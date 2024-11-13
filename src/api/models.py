from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash  #Encriptacion de contraseñas

db = SQLAlchemy()

#Usuario define el modelo de usuario en la base de datos
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # ID único para cada usuario
    username = db.Column(db.String(80), unique=True, nullable=False)  # Campo para el nombre de usuario, debe ser único y no puede ser nulo
    email = db.Column(db.String(120), unique=True, nullable=False)  # Email del usuario, debe ser único y no puede ser nulo
    password_hash = db.Column(db.String(128), nullable=False)  # Hash de la contraseña en lugar de la contraseña en texto plano
    is_active = db.Column(db.Boolean(), default=True, nullable=False)  # Indica si el usuario está activo o no
    balance = db.Column(db.Float, default=0.00)  # Saldo del usuario
    birthdate = db.Column(db.Date, nullable=False)  # Fecha de nacimiento del usuario, utilizada para verificar la mayoría de edad
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow) #Fecha de registro
    reservas = db.relationship('Reserva', backref='usuario', lazy=True) #Relacion con las reservas de vehiculos

    # Método para establecer la contraseña encriptada
    def establecer_contraseña(self, password):
        #Establece la contraseña encriptada
        self.password_hash = generate_password_hash(password)

    # Método para verificar la contraseña en la autenticación
    def verificar_contraseña(self, password):
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
class Vehiculo(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # ID único para cada transacción
    marca = db.Column(db.String(100), nullable=False) #Marca del vehiculo
    modelo = db.Column(db.String(100), nullable=False) #Modelo
    año = db.Column(db.Integer, nullable=False)
    color = db.Column(db.String(50), nullable=False)
    precio_diario = db.Column(db.Float, nullable=False)
    disponibilidad = db.Column(db.Boolean, default=True)
    imagen_url = db.Column(db.String(255))
    reservas = db.relationship('Reserva', backref='vehiculo', lazy=True)

    # Método para serializar los datos del vehiculo en un formato adecuado para API
    def serialize(self):
        return {
            "id": self.id,
            "marca": self.marca,
            "modelo": self.modelo,
            "año": self.año,
            "color": self.color,
            "precio_diario": self.precio_diario,
            "disponibilidad": self.disponibilidad,
            "imagen_url": self.imagen_url,
        }
    
# Reserva que define el modelo de reservas de vehculos
class Reserva(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    vehiculo_id = db.Column(db.Integer, db.ForeignKey('vehiculo.id'), nullable=False)
    fecha_inicio = db.Column(db.DateTime, nullable=False)
    fecha_fin = db.Column(db.DateTime, nullable=False)
    estado = db.Column(db.String(50), default="pendiente")
    pago_realizado =db.Column(db.Boolean, default=False)
    mantenimiento_reservado = db.Column(db.Boolean, default=False)
    monto_total =db.Column(db.Float, nullable=False)

    #Serializar los datos de la reserva
    def serializar(self):
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "vehiculo_id": self.vehiculo_id,
            "fecha_inicio": self.fecha_inicio,
            "fecha_fin": self.fecha_fin,
            "estado": self.estado,
            "pago_realizado": self.pago_realizado,
            "mantenimiento_reservado": self.mantenimiento_reservado,
            "monto_total": self.monto_total,
        }
    
class Mantenimiento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reserva_id = db.Column(db.Integer, db.ForeignKey('reserva.id'), nullable=False)
    tipo = db.Column(db.String(100), nullable=False)
    fecha_reserva = db.Column(db.DateTime, nullable=False)
    realizado = db.Column(db.Boolean, default=False)
    comentarios = db.Column(db.String(255))

    #Serializar mantenimiento
    def serializar(self):
        return{
            "id": self.id,
            "reserva_id": self.reserva_id,
            "tipo": self.tipo,
            "fecha_reserva": self.fecha_reserva,
            "realizado": self.realizado,
            "comentarios": self.comentarios,
        }
