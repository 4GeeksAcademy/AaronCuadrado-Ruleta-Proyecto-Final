import os
from flask import Flask
from flask_migrate import Migrate
from api.models import db
from api.routes import api  # Importar el blueprint
from api.admin import setup_admin
from api.commands import setup_commands

app = Flask(__name__)
app.url_map.strict_slashes = False

# Configuración de la base de datos (SQLite o PostgreSQL)
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///ruleta_database.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicialización de la base de datos y migraciones
db.init_app(app)
MIGRATE = Migrate(app, db)

# Configurar el admin
setup_admin(app)

# Configurar los comandos
setup_commands(app)

# Registrar el blueprint para las rutas
app.register_blueprint(api, url_prefix='/api')

# Ruta principal (puedes eliminarla si no es necesaria)
@app.route('/')
def home():
    return "Bienvenido al casino online!"

# Ejecutar la aplicación si se ejecuta directamente
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)
