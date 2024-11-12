from flask import Blueprint, request, jsonify, session
from api.models import db, User, TransactionHistory
import random

blackjack = Blueprint('blackjack', __name__)

# Función para obtener una carta aleatoria
def get_card():
    """Genera una carta aleatoria en el rango 1-11 (simulando valores de cartas en Blackjack)"""
    card = random.choice([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 11])
    return card

# Rango de apuestas válidas
VALID_BETS = [0.20, 0.50, 1.00, 2.00, 5.00, 10.00, 25.00, 50.00, 100.00]

# RUTA DE APUESTA INICIAL
@blackjack.route('/bet', methods=['POST'])
def place_bet():
    # Verificar si el usuario está autenticado
    if 'user_id' not in session:
        return jsonify({"error": "No tienes acceso, debes iniciar sesión"}), 401
    
    data = request.get_json()
    amount = data.get('amount')

    # Validación de la apuesta
    if not amount or float(amount) not in VALID_BETS:
        return jsonify({"error": "Cantidad de apuesta no válida"}), 400

    # Obtener el usuario y verificar el saldo
    user = User.query.get(session['user_id'])
    if user.balance < float(amount):
        return jsonify({"error": "Saldo insuficiente"}), 400
    
    # Reducir el balance del usuario por la cantidad apostada
    user.balance -= float(amount)
    db.session.commit()

    # Iniciar manos de jugador y dealer
    player_hand = [get_card(), get_card()]
    dealer_hand = [get_card(), get_card()]

    # Comprobar si el jugador tiene un Blackjack natural (21)
    player_score = sum(player_hand)
    dealer_score = sum(dealer_hand)
    message = ""
    if player_score == 21:
        winnings = float(amount) * 2.5  # Paga 2.5 veces la apuesta en caso de Blackjack
        user.balance += winnings
        message = f"¡Blackjack! Has ganado {winnings}€."
    else:
        winnings = 0
        message = "Apuesta realizada. Puedes pedir otra carta o plantarte."

    # Registrar la transacción en el historial
    new_transaction = TransactionHistory(
        user_id=user.id,
        transaction_type="blackjack_bet",
        amount=amount,
        result="Ganancia" if winnings > 0 else "En curso"
    )
    db.session.add(new_transaction)
    db.session.commit()

    return jsonify({
        "message": message,
        "player_hand": player_hand,
        "dealer_hand": [dealer_hand[0], "hidden"],  # Mostrar solo una carta del dealer
        "player_score": player_score,
        "new_balance": user.balance
    }), 200

# RUTA PARA PEDIR CARTA (HIT)
@blackjack.route('/hit', methods=['POST'])
def hit():
    # Verificar si el usuario está autenticado
    if 'user_id' not in session:
        return jsonify({"error": "No tienes acceso, debes iniciar sesión"}), 401
    
    data = request.get_json()
    player_hand = data.get('player_hand')
    dealer_hand = data.get('dealer_hand')

    # Añadir una carta a la mano del jugador
    player_hand.append(get_card())
    player_score = sum(player_hand)

    # Comprobar si el jugador se pasa de 21
    if player_score > 21:
        message = "Te has pasado de 21. Has perdido la apuesta."
        return jsonify({
            "message": message,
            "player_hand": player_hand,
            "player_score": player_score,
            "dealer_hand": dealer_hand,
            "new_balance": User.query.get(session['user_id']).balance
        }), 200

    return jsonify({
        "player_hand": player_hand,
        "player_score": player_score,
        "dealer_hand": dealer_hand,
        "message": "Carta añadida."
    }), 200

# RUTA PARA PLANTARSE (STAND)
@blackjack.route('/stand', methods=['POST'])
def stand():
    # Verificar si el usuario está autenticado
    if 'user_id' not in session:
        return jsonify({"error": "No tienes acceso, debes iniciar sesión"}), 401
    
    data = request.get_json()
    player_hand = data.get('player_hand')
    dealer_hand = data.get('dealer_hand')
    player_score = sum(player_hand)

    # Lógica del dealer: pedir cartas hasta tener al menos 17
    while sum(dealer_hand) < 17:
        dealer_hand.append(get_card())

    dealer_score = sum(dealer_hand)
    user = User.query.get(session['user_id'])
    amount = request.get_json().get("amount")
    winnings = 0

    # Determinar el resultado de la partida
    if dealer_score > 21 or player_score > dealer_score:
        winnings = float(amount) * 2
        user.balance += winnings
        message = f"Has ganado {winnings}€."
    elif player_score == dealer_score:
        winnings = float(amount)
        user.balance += winnings
        message = "Empate. Se devuelve tu apuesta."
    else:
        message = f"Has perdido la apuesta de {amount}€."

    # Registrar resultado en el historial
    result = "Ganancia" if winnings > 0 else "Perdida"
    new_transaction = TransactionHistory(
        user_id=user.id,
        transaction_type="blackjack_result",
        amount=amount,
        result=result
    )
    db.session.add(new_transaction)
    db.session.commit()

    return jsonify({
        "message": message,
        "dealer_hand": dealer_hand,
        "dealer_score": dealer_score,
        "player_score": player_score,
        "new_balance": user.balance
    }), 200

# RUTA PARA DUPLICAR LA APUESTA (DOUBLE)
@blackjack.route('/double', methods=['POST'])
def double_down():
    # Verificar si el usuario está autenticado
    if 'user_id' not in session:
        return jsonify({"error": "No tienes acceso, debes iniciar sesión"}), 401

    user = User.query.get(session['user_id'])
    data = request.get_json()
    amount = data.get("amount")
    player_hand = data.get("player_hand")

    # Verificar si el usuario tiene suficiente saldo para duplicar la apuesta
    if user.balance < float(amount):
        return jsonify({"error": "Saldo insuficiente para duplicar la apuesta."}), 400

    # Duplicar la apuesta y actualizar el balance del usuario
    user.balance -= float(amount)
    player_hand.append(get_card())
    player_score = sum(player_hand)

    # Comprobar si el jugador se pasa de 21 después de duplicar la apuesta
    if player_score > 21:
        message = "Te has pasado de 21. Has perdido la apuesta."
        db.session.commit()
        return jsonify({
            "message": message,
            "player_hand": player_hand,
            "player_score": player_score,
            "new_balance": user.balance
        }), 200

    db.session.commit()

    return jsonify({
        "message": "Apuesta duplicada. Carta añadida.",
        "player_hand": player_hand,
        "player_score": player_score,
        "new_balance": user.balance
    }), 200
