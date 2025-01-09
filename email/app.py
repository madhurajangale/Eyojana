# from flask import Flask, render_template, request, redirect, url_for,session,jsonify
# from flask_mail import Mail
# from datetime import datetime, timedelta
# import schedule
# import time
# from threading import Thread
# from flask_mail import Message
# import json
# from datetime import datetime, timedelta, timezone
# from flask_cors import CORS
# local_server =True
# app = Flask(__name__, static_folder='static')
# CORS(app)

# mail = Mail(app)
# with open("C:\\Docs\\Rujuta\\techathon\\Eyojana\\email\\config.json") as c:
#      params=json.load(c)["params"]

# app.config.update(
#    MAIL_SERVER='Smtp.gmail.com',
#    MAIL_PORT='465',
#    MAIL_USE_SSL=True,
#    MAIL_USERNAME=params['gmail-user'],
#    MAIL_PASSWORD=params['gmail-password'],
#    MAIL_DEFAULT_SENDER=params['gmail-user']

# )
# # def send_reminder_emails():
# #     with app.app_context():
# #         current_time = datetime.now(timezone.utc)
# #         tasks_to_remind = Data.query.filter(Data.date == current_time.date() + timedelta(days=1)).all()
# #         for task in tasks_to_remind:
# #             user = User.query.filter_by(email=task.email).first()
# #             if user:
# #                 msg = Message('Task Reminder', recipients=[user.email])
# #                 msg.body = f"Don't forget to complete your task: {task.title}"
# #                 mail.send(msg)

# # def schedule_reminder_emails():
# #     schedule.every().day.at("21:34").do(send_reminder_emails)

# # schedule_reminder_emails()

# # def scheduler_thread():
# #     while True:
# #         schedule.run_pending()
# #         time.sleep(1)


# @app.route('/send_email', methods=['POST'])
# def send_email_route():
#     print("hello")
#     data = request.json
#     email = data.get('email')
#     task_title = data.get('task_title')

#     if not email or not task_title:
#         return jsonify({'error': 'Email and task title are required'}), 400

#     msg = Message('Task Reminder', recipients=[email])
#     msg.body = f"Don't forget to complete your task: {task_title}"
#     mail.send(msg)

#     return jsonify({'message': 'Email sent successfully'}), 200
# if __name__ == '__main__':
#     app.run( debug=True,port=5001)


from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



# Flask-Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'madhurajangle2004@gmail.com'  # Service email
app.config['MAIL_PASSWORD'] = 'obyf xczb elyv ugsi'  # Use app password or secure method
app.config['MAIL_DEFAULT_SENDER'] = 'madhurajangle2004@gmail.com'

mail = Mail(app)

@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.json
    try:
        # Prepare message body based on the support option
        support_info = ""
        if data['supportOption'] == 'call':
            support_info = f"Phone Number: {data.get('phone', 'N/A')}"
        elif data['supportOption'] == 'chat':
            support_info = f"WhatsApp Number: {data.get('whatsapp', 'N/A')}"
        
        msg = Message(
            subject="User Support Request",
            sender=app.config['MAIL_DEFAULT_SENDER'],
            recipients=['madhurajangle2004@gmail.com'],  # Recipient email
        )
        msg.body = f"""
        Personalized Support needed by the following user:

        Name: {data['name']}
        Email: {data['email']}
        Message: {data['message']}
        Support Option: {data['supportOption']}
        {support_info}
        
        Please contact the user as soon as possible.
        """

        msg.reply_to = data['email']
        mail.send(msg)

        return jsonify({'message': 'Your message for personalized support has been sent successfully! You will be contacted shortly.'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
@app.route('/application-email', methods=['POST'])
def application_email():
    data = request.json
    recipient_email = data.get('email')  # Email of the user from form
    schemename = data.get('schemename')  # Scheme name from form

    if not recipient_email or not schemename:
        return jsonify({'error': 'Email and scheme name are required'}), 400

    try:
        message_body = f"You have successfully submitted the application for the scheme {schemename}."
        msg = Message('Application Submitted', recipients=[recipient_email])
        msg.body = message_body
        mail.send(msg)
        return jsonify({'message': 'Email sent successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


    
if __name__ == '__main__':
    app.run( debug=True,port=5001)

