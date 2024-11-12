from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash  # Para encriptar la contraseña

db = SQLAlchemy()

# Clase User que define el modelo de usuario en la base de datos
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # ID único para cada usuario
    username = db.Column(db.String(80), unique=True, nullable=False)  # Campo para el nombre de usuario, debe ser único y no puede ser nulo
    email = db.Column(db.String(120), unique=True, nullable=False)  # Email del usuario, debe ser único y no puede ser nulo
    password_hash = db.Column(db.String(128), nullable=False)  # Hash de la contraseña en lugar de la contraseña en texto plano
    is_active = db.Column(db.Boolean(), default=True, nullable=False)  # Indica si el usuario está activo o no
    balance = db.Column(db.Float, default=200.00)  # Saldo del usuario, por defecto 200€
    birthdate = db.Column(db.Date, nullable=False)  # Fecha de nacimiento del usuario, utilizada para verificar la mayoría de edad
    transactions = db.relationship('TransactionHistory', backref='user', lazy=True)  # Relación con el historial de transacciones

    # Método que devuelve una representación en cadena del objeto User
    def __repr__(self):
        return f'<User {self.email}>'

    # Método para establecer la contraseña encriptada
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # Método para verificar la contraseña en la autenticación
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    # Método para serializar los datos del usuario en un formato adecuado para API
    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,  # Incluimos el username en la serialización
            "email": self.email,
            "balance": self.balance,
            # No serializar la contraseña, es una violación de seguridad
        }


# Clase TransactionHistory para almacenar el historial de transacciones del usuario
class TransactionHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # ID único para cada transacción
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Relación con el ID del usuario (clave foránea)
    transaction_type = db.Column(db.String(50), nullable=False)  # Tipo de transacción, por ejemplo "blackjack_bet" o "deposit"
    amount = db.Column(db.Float, nullable=False)  # Cantidad involucrada en la transacción
    result = db.Column(db.String(50), nullable=True)  # Resultado de la transacción, como "Ganancia", "Perdida", "En curso"
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())  # Marca de tiempo de la transacción

    # Método para serializar los datos de la transacción en un formato adecuado para API
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,  # ID del usuario asociado a la transacción
            "transaction_type": self.transaction_type,  # Tipo de transacción
            "amount": self.amount,  # Cantidad de la transacción
            "result": self.result,  # Resultado de la transacción
            "timestamp": self.timestamp  # Fecha y hora de la transacción
        }
