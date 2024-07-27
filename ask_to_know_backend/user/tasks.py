from django.core.mail import send_mail
from celery import shared_task

@shared_task
def send_agent_create_mail(username, email, generated_password):
    message = (f"A new agent is registered for {username}. You receive a random password {generated_password}."
               f"You can update your password any time from the website. For login please use this email and "
               f"password first time.")
    send_mail("New Agent Account Created", message, None, (email,), fail_silently=True)
