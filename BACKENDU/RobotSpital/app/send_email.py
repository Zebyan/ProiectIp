import smtplib
from email.message import EmailMessage

def send_email_notification(to_email: str, body: str, from_password: str):
    from_email = "proiectip@yahoo.com"
    subject = "Cont nou creat - Date autentificare"

    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = from_email
    msg['To'] = to_email
    msg.set_content(body)

    try:
        with smtplib.SMTP('smtp.mail.yahoo.com', 587) as smtp:
            smtp.starttls()
            smtp.login(from_email, from_password)
            smtp.send_message(msg)
        print("Email trimis cu succes!")
    except Exception as e:
        print(f"Eroare la trimiterea emailului: {e}")

