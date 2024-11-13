from flask import Blueprint, jsonify, request, session
from api.models import db, Maintenance, Booking
from datetime import datetime

maintenance = Blueprint('maintenance', __name__)

#Ruta para obtener todos los mantenimientos
@maintenance.route('/maintenance', methods=['GET'])
def get_maintenance():

    if 'user_id' not in session:
        return jsonify({"error": "Acceso no autorizado"}), 403
    
    #Obtener todos los mantenimientos de la base de datos
    maintenances = Maintenance.query.all()
    maintenances_list = [maintenance.serialize() for maintenance in maintenances]

    return jsonify(maintenances_list), 200

#Ruta para obtener un mantenimiento en especifico
@maintenance.route('/maintenance/<int:maintenance_id>', methods=['GET'])
def get_maintenance_by_id(maintenance_id):

    if 'user_id' not in session:
        return jsonify({"error":"Acceso no autorizado"}), 403
    
    maintenance = Maintenance.query.get(maintenance_id)
    if not maintenance:
        return jsonify({"error":"Mantenimiento no encontrado"}), 404
    
    return jsonify(maintenance.serialize()), 200

#Ruta para crear un nuevo mantenimiento
@maintenance.route('/maintenance', methods=['POST'])
def create_maintenance():

    if 'user_id' not in session:
        return jsonify({"error":"Acceso no autorizado"}), 403
    
    data = request.get_json()
    booking_id = data.get('booking_id')
    maintenance_type = data.get('type')
    reservation_date = data.get('reservation_date')

    #verificar que los campos necesarios estan completos
    if not booking_id or not maintenance_type or not reservation_date:
        return jsonify({"error":" Todos los campos son obligatorios"}), 400
    
    #Obtener la reserva asociada al mantenimiento
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"error": "Reserva no encontrada"}), 404
    
    #Verificar si el mantenimiento ya fue reservado para esta reserva
    existing_maintenance = Maintenance.query.filter_by(booking_id=booking_id).first()
    if existing_maintenance:
        return jsonify({"error":"Mantenimiento ya reservado para esta reserva"}), 400
    
    #Crear el registro de mantenimiento
    new_maintenance = Maintenance(
        booking_id=booking_id,
        type=maintenance_type,
        reservation_Date=datetime.strptime(reservation_date, "%Y-%m-%d %H:%M:%S"),
        completed=False,
        comments="",
    )

    db.session.add(new_maintenance)
    db.session.commit()

    return jsonify({"message":"Mantenimiento reservado con exito", "maintenance": new_maintenance.serialize()}), 201


#Ruta para marcar un mantenimiento como completado
@maintenance.route('/maintenance/<int:maintenance_id>/complete', methods=['PUT'])
def complete_maintenance(maintenance_id):

    if 'user_id' not in session:
        return jsonify({"error":"Acceso no autorizado"}), 403
    
    #Obtener el mantenimiento por su id
    maintenance = Maintenance.query.get(maintenance_id)
    if not maintenance:
        return jsonify({"error": "Mantenimiento no encontrado"}), 404
    
    #Verificar si el mantenimiento ya esta completado
    if maintenance.completed:
        return jsonify({"error":"El mantenimiento ya ha sido completado"}), 400
    
    #Marcar el mantenimiento como completado
    maintenance.completed = True
    db.session.commit()

    return jsonify({"message": "Mantenimiento completado con exito", "maintenance": maintenance.serialize()}), 200