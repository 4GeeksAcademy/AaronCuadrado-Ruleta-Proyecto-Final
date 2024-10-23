from flask import Blueprint, jsonify
from api.models import db, User

users = Blueprint('users', __name__)


#RUTA DE USUARIOS
@users.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = [user.serialize() for user in users]
    return jsonify(users_list), 200