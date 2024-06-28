import sys
import asyncio
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from datetime import datetime, timezone, timedelta

# The serviceAccountKey.json file is where the authentication key to access the firebase project which contains the database and authentication data.
cred = credentials.Certificate("serviceAccountKey.json")
app = firebase_admin.initialize_app(cred)
db = firestore.client()


PORT = 8080
IP_ADDR = "192.168.100.1"
prev_message = ""
rfid_scan_only = False


def get_id_of_doc(uid_tag: str) -> str:
    docs = list(db.collection("Students").where(
        filter=FieldFilter("RFIDCode", "==", uid_tag)).stream())
    return docs[0].id


def record_attendance(uid_tag: str):
    uid_tag = uid_tag.replace(" ", "")

    current_utc_time = datetime.now(timezone.utc)
    formatted_date = current_utc_time + timedelta(hours=8)
    formatted_date = formatted_date.strftime("%A, %B %d, %Y %I:%M:%S %p")

    print(
        f"Student with UID of {uid_tag} tapped NFC card at {formatted_date}")
    record = {"TimeIn": current_utc_time}
    id_of_doc = get_id_of_doc(uid_tag)
    doc_ref = db.collection("Students").document(
        id_of_doc).collection("AttendanceRecords")
    doc_ref.add(record)


async def handle_client(reader, writer):
    global prev_message
    data = await reader.read(100)
    message = data.decode()
    addr = writer.get_extra_info("peername")

    if message != prev_message and len(message) == 12:
        print(f"Received UID tag from {addr}: {message}")
        if not rfid_scan_only:
            record_attendance(message)
        prev_message = message

    print(f"Closing the connection from {addr}")
    writer.close()


async def tcpServer():
    server = await asyncio.start_server(
        handle_client, IP_ADDR, PORT)

    addr = server.sockets[0].getsockname()
    print(f"Server listening on {addr}")

    async with server:
        await server.serve_forever()

if __name__ == "__main__":
    # To record an attendance, uncomment this function. This is use for testing purposes only
    # record_attendance("ABCDEF00")

    if len(sys.argv) == 1:
        print("Please specify runtime mode:\n SCAN - Scanning only\n DEV - Scanning and forwarding data to server")
        print("Sample usage:\n python server.py SCAN")
        sys.exit(0)

    mode = sys.argv[1]
    if mode == "SCAN":
        print("Running in RFID scan mode...")
        rfid_scan_only = True
    elif mode == "DEV":
        print("Running in development mode...")
        rfid_scan_only = False

    asyncio.run(tcpServer())
