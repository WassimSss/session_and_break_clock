import React from 'react';
import './App.css';

class App extends React.Component {
	constructor(props) {
		const sessionLengthStart = 10;
		const breakLengthStart = 5;
		super(props);

		// Initialisation des états, y compris les longueurs de session et de pause, le démarrage du minuteur, le temps du minuteur et le son.
		this.state = {
			breakLength: breakLengthStart,
			sessionLength: sessionLengthStart,
			timerStart: { type: 'timer', isStart: false }, // Le minuteur commence en mode 'timer' (session) et est arrêté.
			timer: {
				minute: sessionLengthStart,
				second: 0
			},
			breakTime: {
				minute: breakLengthStart,
				second: 0
			},
			audio: new Audio('/ping-82822.mp3') // Son pour la notification
		};

		// Liaison des fonctions de gestion des événements aux méthodes de la classe.
		this.changeParameter = this.changeParameter.bind(this);
		this.startTimer = this.startTimer.bind(this);
		this.stopTimer = this.stopTimer.bind(this);
		this.reset = this.reset.bind(this);
		this.timerInterval = null; // Initialisation de l'intervalle du minuteur.
	}

	// Fonction pour changer la longueur de la session ou de la pause.
	changeParameter(parameterName, parameterChange) {
		if (parameterName === 'break') {
			if (parameterChange === 'increment' && this.state.breakLength < 60) {
				this.setState({ ...this.state, breakLength: this.state.breakLength + 1 });
			} else if (parameterChange === 'decrement' && this.state.breakLength > 1) {
				this.setState({ ...this.state, breakLength: this.state.breakLength - 1 });
			}
		} else if (parameterName === 'session') {
			if (parameterChange === 'increment' && this.state.sessionLength < 60) {
				this.setState({ ...this.state, sessionLength: this.state.sessionLength + 1 });
			} else if (parameterChange === 'decrement' && this.state.sessionLength > 1) {
				this.setState({ ...this.state, sessionLength: this.state.sessionLength - 1 });
			}
		}
	}

	// Fonction pour démarrer le minuteur.
	startTimer() {
		// Démarrer le minuteur en modifiant l'état timerStart.
		this.setState({ ...this.state, timerStart: { type: this.state.timerStart.type, isStart: true } });

		// Mettre à jour le minuteur à intervalles réguliers (1s).
		this.timerInterval = setInterval(() => {
			if (this.state.timerStart.type === 'timer') { // Si le minuteur est en mode 'timer' (session).
				if (this.state.timer.second === 0) {
					if (this.state.timer.minute === 0) { // Fin de la session.
						this.setState({ ...this.state, timer: { minute: this.state.sessionLength, second: 0 }, timerStart: { type: 'break', isStart: true } }); // Changer en mode 'break' (pause) et redémarrer le minuteur.
						this.state.audio.play(); // Jouer le son de notification.
					} else {
						this.setState({
							...this.state,
							timer: { minute: this.state.timer.minute - 1, second: 59 }
						});
					}
				} else {
					this.setState({
						...this.state,
						timer: { minute: this.state.timer.minute, second: this.state.timer.second - 1 }
					});
				}
			} else if (this.state.timerStart.type === 'break') { // Si le minuteur est en mode 'break' (pause).
				if (this.state.breakTime.second === 0) {
					if (this.state.breakTime.minute === 0) { // Fin de la pause.
						this.setState({ ...this.state, breakTime: { minute: this.state.breakLength, second: 0 }, timerStart: { type: 'timer', isStart: true } }); // Changer en mode 'timer' (session) et redémarrer le minuteur.
						this.state.audio.play(); // Jouer le son de notification.
					} else {
						this.setState({
							...this.state,
							breakTime: { minute: this.state.breakTime.minute - 1, second: 59 }
						});
					}
				} else {
					this.setState({
						...this.state,
						breakTime: { minute: this.state.breakTime.minute, second: this.state.breakTime.second - 1 }
					});
				}
			}
		}, 50);
	}

	// Fonction pour arrêter le minuteur.
	stopTimer() {
		this.setState({ ...this.state, timerStart: { type: this.state.timerStart.type, isStart: false } });
		clearInterval(this.timerInterval); // Arrêter l'intervalle du minuteur.
	}

	// Fonction pour réinitialiser le minuteur.
	reset() {
		clearInterval(this.timerInterval); // Arrêter l'intervalle du minuteur.
		this.setState({
			...this.state,
			timerStart: { type: 'timer', isStart: false }, // Réinitialiser en mode 'timer' (session) et arrêté.
			timer: {
				minute: this.state.sessionLength,
				second: 0
			},
			breakTime: {
				minute: this.state.breakLength,
				second: 0
			}
		})}

	render() {
		const {timer, breakTime, timerStart} = this.state

		return (
			<div className="main_app">
				<div className="all_label">
					<div className="label" id="break-label">
						<h4>Break length</h4>
						<p className="length" id="break-length">
							{this.state.breakLength}
						</p>
						<div className="all_label_button">
							<div
								className="button"
								id="break-decrement"
								onClick={() => this.changeParameter('break', 'decrement')}
							>
								<ion-icon name="arrow-down-outline" />
							</div>
							<div
								className="button"
								id="break-increment"
								onClick={() => this.changeParameter('break', 'increment')}
							>
								<ion-icon name="arrow-up-outline" />
							</div>
						</div>
					</div>
					<div className="label" id="session-label">
						<h4>Session length</h4>
						<p className="length" id="session-length">
							{this.state.sessionLength}
						</p>
						<div className="all_label_button">
							<div
								className="button"
								id="session-decrement"
								onClick={() => this.changeParameter('session', 'decrement')}
							>
								<ion-icon name="arrow-down-outline" />
							</div>
							<div
								className="button"
								id="session-increment"
								onClick={() => this.changeParameter('session', 'increment')}
							>
								<ion-icon name="arrow-up-outline" />
							</div>
						</div>
					</div>
				</div>
				<div className="timer">
					<h2 id="timer-label">{timerStart.type === 'timer' ? 'Session' : 'Break'}</h2>
					<h3 className="timer-text" id="time-left">
						{(timer.minute < 10 ? '0' : '') + timer.minute}:{(timer.second < 10 ? '0' : '') + timer.second}
					</h3>
					<div className="label" id="timer-button">
						<div
							className="button"
							id="start_stop"
							onClick={timerStart.isStart ? this.stopTimer : this.startTimer}
						>
							{timerStart.isStart ? (
								<ion-icon name="pause-outline" />
							) : (
								<ion-icon name="caret-forward-outline" />
							)}
						</div>
						<div className="button" id="reset" onClick={this.reset}>
							<ion-icon name="refresh-outline" />
						</div>
					</div>
				</div>
				<h5 className="timer-text pause-text">
				{(breakTime.minute < 10 ? '0' : '') + breakTime.minute}:{(breakTime.second < 10 ? '0' : '') + breakTime.second}
				</h5>
			</div>
		);
	}
}

export default App;
