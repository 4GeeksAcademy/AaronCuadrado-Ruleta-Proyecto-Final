from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Clase User que define el modelo de usuario en la base de datos
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)  # Campo para el nombre de usuario, debe ser único
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)  # Indica si el usuario está activo o no
    balance = db.Column(db.Float, default=200.00)  # Dinero del usuario y registro con 200€ por defecto

    # Método que devuelve una representación en cadena del objeto User
    def __repr__(self):
        return f'<User {self.email}>'

    # Método para serializar los datos del usuario en un formato adecuado para API
    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,  # Incluimos el username en la serialización
            "email": self.email,
            "balance": self.balance,
            # do not serialize the password, it's a security breach
        }


# Clase para almacenar el historial de transacciones del usuario
class TransactionHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    transaction_type = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    result = db.Column(db.String(50), nullable=True)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "transaction_type": self.transaction_type,
            "amount": self.amount,
            "result": self.result,
            "timestamp": self.timestamp
        }
