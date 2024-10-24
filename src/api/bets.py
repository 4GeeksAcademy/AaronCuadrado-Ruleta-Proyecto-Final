from flask import Blueprint, request, jsonify, session
import random
from api.models import db, User, TransactionHistory

bets = Blueprint('bets', __name__)

#NUMEROS EN LA RULETA
BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]
RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]

#Fichas para apostar
VALID_BETS = [0.20, 0.50, 1.00, 2.00, 5.00, 10.00, 25.00, 50.00, 100.00]

#Lista para almacenar los ultimos numeros
LAST_NUMBERS = []

#APUESTAS Y TIPOS DE APUESTAS/GANANCIAS
@bets.route('/bet', methods=['POST'])
def bet():
    if 'user_id' not in session:
        return jsonify({"error": "No tienes acceso, debes iniciar sesion"})
    
    data = request.get_json() #Obtener datos de la solicitud
    amount = data.get('amount')
    bet_type = data.get('bet_type')
    bet_value = data.get('bet_value')

    #Verificar que la cantidad apostada corresponde a una ficha valida
    if float(amount) not in VALID_BETS:
        return jsonify ({"error": f"La cantidad para apostar no es valida"})

    #verificar que la cantidad es valida
    if not amount or float(amount) <=0:
        return jsonify({"error": "Cantidad no valida"}), 400
    
    user = User.query.get(session['user_id'])

    #saldo insuficiente para apostar
    if user.balance < float(amount):
        return jsonify({"error": "Saldo insuficiente"}), 400
    
    user.balance -= float(amount)

    #generar numero aleatorio entre 0 y 36
    roulette_number = random.randint(0, 36)

    #Almacenar ultimos 10 numeros en la lista
    LAST_NUMBERS.append(roulette_number)
    if len(LAST_NUMBERS) > 10:
        LAST_NUMBERS.pop(0)

    #verificar el color segun su numero
    if roulette_number == 0:
        roulette_color = "green"
    elif roulette_number in BLACK_NUMBERS:
        roulette_color = "black"
    else:
        roulette_color = "red"

    winnings = 0  #Ganancias iniciales
    message = ""

    #Logica para apostar a un numero
    if bet_type == "number":
        if int(bet_value) == roulette_number:
            winnings = float(amount) * 36 #Multiplica por 36 si el numero es correcto
            message = f"!Felicidades¡ Has ganado {winnings}€ con el numero {roulette_number}"
        else:
            #Pierde el dinero apostado si no acierta
            message = f"Has perdido {amount}€. El numero ganador ha sido {roulette_number}€"

    #Logica para apuestas por color
    elif bet_type == "color":
        if bet_value == roulette_color:
            winnings = float(amount) * 2 #Multiplica por 2 si acierta el color
            message = f"¡Felicidades! Has ganado {winnings}€ apostando al color {bet_value}."
        else: 
            
            message = f"Has perdido {amount}€. El número ganador fue {roulette_number} ({roulette_color})."

    #Logica para apuestas de pares/impares
    elif bet_type == "parity":

        if (bet_value == "pares" and roulette_number % 2 == 0) or (bet_value == "impares" and roulette_number % 2 != 0):
            winnings = float(amount) * 2 #Multiplica por 2 si acierta si es par o impar
            message = f"¡Felicidades! Has ganado {winnings}€ apostando a {bet_value}."
        else:
         
            message = f"Has perdido {amount}€. El número ganador fue {roulette_number}."
    
    #Actualiza el balance del usuario si gana o pierde
    user.balance += winnings
    db.session.commit()

    #Registrar la apuesta en el historial de transacciones
    new_transaction = TransactionHistory(
        user_id=user.id,
        transaction_type="bet",
        amount=amount,
        result="Ganancia" if winnings > 0 else "Perdida"
    )
    db.session.add(new_transaction)
    db.session.commit()

    #devuelve el resultado de la apuesta
    return jsonify({
        "message": message,
        "new_balance": user.balance,
        "roulette_number": roulette_number,
        "roulette_color": roulette_color
    }), 200

#Ruta para obtener los ultimos numeros
@bets.route('/last-numbers', methods=['GET'])
def get_last_numbers():
    return jsonify({
        "last_numbers": LAST_NUMBERS
    }), 200