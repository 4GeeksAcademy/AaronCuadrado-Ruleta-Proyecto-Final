from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash  #Encriptacion de contraseñas

db = SQLAlchemy()

#Usuario define el modelo de usuario en la base de datos
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # ID único para cada usuario
    username = db.Column(db.String(80), unique=True, nullable=False)  # Campo para el nombre de usuario, debe ser único y no puede ser nulo
    email = db.Column(db.String(120), unique=True, nullable=False)  # Email del usuario, debe ser único y no puede ser nulo
    password_hash = db.Column(db.String(128), nullable=False)  # Hash de la contraseña en lugar de la contraseña en texto plano
    is_active = db.Column(db.Boolean(), default=True, nullable=False)  # Indica si el usuario está activo o no
    balance = db.Column(db.Float, default=0.00)  # Saldo del usuario
    birthdate = db.Column(db.Date, nullable=False)  # Fecha de nacimiento del usuario, utilizada para verificar la mayoría de edad
    registration_date = db.Column(db.DateTime, default=datetime.utcnow) #Fecha de registro
    bookings = db.relationship('Booking', backref='user', lazy=True) #Relacion con las reservas de vehiculos

    # Método para establecer la contraseña encriptada
    def set_password(self, password):
        #Establece la contraseña encriptada
        self.password_hash = generate_password_hash(password)

    # Método para verificar la contraseña en la autenticación
    def check_password(self, password):
        #Verifica si la contraseña ingresada coincide con el hash almacenado
        return check_password_hash(self.password_hash, password)

    # Método para serializar los datos del usuario en un formato adecuado para API
    def serialize(self):
        #Convertir los datos del usuario a un formato JSON adecuado
        return {
            "id": self.id,
            "username": self.username, 
            "email": self.email,
            "balance": self.balance,
            # No se incluye la contraseña por seguridad
        }

# Clase Vehiculo que define el modelo de vehiculo en la base de datos
class Vehicle(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # ID único para cada transacción
    brand = db.Column(db.String(100), nullable=False) #Marca del vehiculo
    model = db.Column(db.String(100), nullable=False) #Modelo
    year = db.Column(db.Integer, nullable=False)
    color = db.Column(db.String(50), nullable=False)
    daily_rate = db.Column(db.Float, nullable=False)
    availability = db.Column(db.Boolean, default=True)
    image_url = db.Column(db.String(255))
    bookings = db.relationship('Booking', backref='vehicle', lazy=True)

    # Método para serializar los datos del vehiculo en un formato adecuado para API
    def serialize(self):
        return {
            "id": self.id,
            "brand": self.brand,
            "model": self.model,
            "year": self.year,
            "color": self.color,
            "daily_rate": self.daily_rate,
            "availability": self.availability,
            "image_url": self.image_url,
        }
    
# Reserva que define el modelo de reservas de vehculos
class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), default="pending")
    payment_completed = db.Column(db.Boolean, default=False)
    maintenance_booked = db.Column(db.Boolean, default=False)
    total_amount = db.Column(db.Float, nullable=False)

    #Serializar los datos de la reserva
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "vehicle_id": self.vehicle_id,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "status": self.status,
            "payment_completed": self.payment_completed,
            "maintenance_booked": self.maintenance_booked,
            "total_amount": self.total_amount,
        }
    
class Maintenance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.id'), nullable=False)
    type = db.Column(db.String(100), nullable=False)
    reservation_date = db.Column(db.DateTime, nullable=False)
    completed = db.Column(db.Boolean, default=False)
    comments = db.Column(db.String(255))

    #Serializar mantenimiento
    def serializar(self):
        return{
            "id": self.id,
            "booking_id": self.booking_id,
            "type": self.type,
            "reservation_date": self.reservation_date,
            "completed": self.completed,
            "comments": self.comments,
        }
