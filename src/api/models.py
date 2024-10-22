from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

#Clase User que define el modelo de usuario en la base de datos
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False) #indica si el usuario esta activo o no
    balance = db.Column(db.Float, default=200.00)
    #dinero del usuario y registro con 200€ por defecto

    # Método que devuelve una representación en cadena del objeto User
    def __repr__(self):
        return f'<User {self.email}>'


# Método para serializar los datos del usuario en un formato adecuado para API
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "balance": self.balance,
            # do not serialize the password, its a security breach
        }