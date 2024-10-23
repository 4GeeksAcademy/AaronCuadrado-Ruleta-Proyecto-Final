from flask import Blueprint, request, jsonify, session
import random
from api.models import db, User

bets = Blueprint('bets', __name__)


#APUESTAS Y TIPOS DE APUESTAS/GANANCIAS
@bets.route('/bet', methods=['POST'])
def bet():
    if 'user_id' not in session:
        return jsonify({"error": "No tienes acceso, debes iniciar sesion"})
    
    data = request.get_json()
    amount = data.get('amount')
    bet_type = data.get('bet_type')
    bet_value = data.get('bet_value')

    if not amount or float(amount) <=0:
        return jsonify({"error": "Cantidad no valida"})
    
    user=User.query.get(session['user_id'])

    if user.balance < float(amount):
        return jsonify({"error": "Saldo insuficiente"}), 400
    
    roulette_number = random.randint(0, 36)
    roulette_color = "black" if roulette_number in BLACK_NUMBERS else "red" if roulette_number in RED_NUMBERS else "green"

    winnings = 0
    message = ""

    if bet_type == "number":
        if int(bet_value) == roulette_number:
            winnings = float(amount) * 36
            message = f"!Felicidades¡ Has ganado {winnings}€ con el numero {roulette_number}"
        else:
            winnings = -float(amount)
            message = f"Has perdido {amount}€. El numero ganador ha sido {roulette_number}€"

    elif bet_type == "color":

        if bet_value == roulette_color:
            winnings = float(amount) * 2
            message = f"¡Felicidades! Has ganado {winnings}€ apostando al color {bet_value}."
        else: winnings = -float(amount)
        message = f"Has perdido {amount}€. El número ganador fue {roulette_number} ({roulette_color})."

    elif bet_type == "parity":

        if (bet_value == "even" and roulette_number % 2 == 0) or (bet_value == "old" and roulette_number % 2 != 0):
            winnings = float(amount) * 2
            message = f"¡Felicidades! Has ganado {winnings}€ apostando a {bet_value}."
        else:
            winnings = -float(amount)
            message = f"Has perdido {amount}€. El número ganador fue {roulette_number}."
    
    user.balance += winnings
    db.session.commit()

    return jsonify({
        "message": message,
        "new_balance": user.balance,
        "roulette_number": roulette_number,
        "roulette_color": roulette_color
    }), 200