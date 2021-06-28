import { useHistory, useParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { Question } from '../../components/Question';
import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';
// import { useAuth } from '../hooks/useAuth';

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';

import '../Room/styles.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);
  
  async function handleEndRoom() {
    if (window.confirm('Tem certeza que deseja encerrar a sala?')) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      })

      history.push('/');
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button onClick={handleEndRoom} isOutlined>Encerrar sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} Pergunta(s)</span> }
        </div>

        { questions.length > 0 ?
          <div className="question-list">
            {
              questions.map(questions => {
              return (
                <Question
                  key={questions.id}
                  content={questions.content}
                  author={questions.author}
                  isHighlighted={questions.isHighlighted}
                  isAnswered={questions.isAnswered}
                >
                  { !questions.isAnswered && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleCheckQuestionAsAnswered(questions.id)}
                      >
                        <img src={checkImg} alt="Marcar pergunta como respondida" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleHighlightQuestion(questions.id)}
                      >
                        <img src={answerImg} alt="Dar destaque a pergunta" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(questions.id)}
                  >
                    <img src={deleteImg} alt="Remover pergunta" />
                  </button>
                </Question>
              )})
            }
          </div>
          :
          <span className="notQuestion">Esta sala não tem perguntas, <br/>compartilhe o código para recebê-las.</span>   
        }
      </main>
    </div>
  )
}