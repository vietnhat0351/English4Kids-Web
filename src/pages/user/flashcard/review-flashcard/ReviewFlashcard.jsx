import React, { useEffect, useState } from 'react'
import customFetch from '../../../../utils/customFetch';
import { useParams } from 'react-router-dom';
import { Button, IconButton, TextField, Tooltip } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import './ReviewFlashcard.css';

const ReviewFlashcard = () => {
    const flashcardSetId = useParams().flashcardSetId;
    const [question, setQuestion] = useState(0);
    const [total, setTotal] = useState(0);
    const [flashcards, setFlashcards] = useState([]);
    const progressPercent = total > 0 ? (question / total) * 100 : 0;
    const [answer, setAnswer] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [inCorrectFlashcards, setInCorrectFlashcards] = useState([]);

    const handleSubmitAnswer = () => {
        setIsSubmitted(true);
        if (answer.toLowerCase() === flashcards[question].word.toLowerCase()) {
            setTimeout(() => {
                setQuestion(question + 1);
                setAnswer("");
                setIsSubmitted(false);
            }, 1000);
        } else {
            alert("Sai rồi");
            setTimeout(() => {
                setQuestion(question + 1);
                setInCorrectFlashcards([...inCorrectFlashcards, flashcards[question]]);
                setAnswer("");
                setIsSubmitted(false);
            }, 1500);
        }

    }

    useEffect(() => {
        customFetch.get(`/api/v1/flashcards/get-flashcard-set/${flashcardSetId}`)
            .then(response => {
                let c = response.data.flashcards.sort(() => Math.random() - 0.5);
                setFlashcards(c);
                setTotal(c.length);
            })
            .catch(error => {
                console.error(error);
            })
    }, [flashcardSetId])

    const ShowResult = () => {
        return (
            <div>
                <h1>Kết quả</h1>
                <p>Số câu đúng: {question - inCorrectFlashcards.length} / {total}</p>
                <p>Số câu sai: {inCorrectFlashcards.length}</p>
                <div>
                    <Button variant="contained" color="primary" onClick={() => {
                        setQuestion(0);
                        setFlashcards(inCorrectFlashcards);
                        setTotal(inCorrectFlashcards.length);
                        setInCorrectFlashcards([]);
                    }}>Tiếp Tục</Button>
                </div>
            </div>
        )
    }
    return (
        <div>
            <div className="learn-session-header">
                <div className="progress-header">
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                    <button>
                        <Tooltip title="Close">
                            <IconButton
                                onClick={() => {
                                    window.location.href = "/";
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </button>
                </div>
                <p>
                    Tiến trình: {question}/{total}
                </p>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                {
                    flashcards[question] && (
                        <div className="flashcard">
                            <img src={flashcards[question].image} alt="flashcard" style={{
                                width: "200px",
                                height: "200px",
                            }} />
                            <div className="flashcard-meaning">
                                {flashcards[question].meaning}
                            </div>
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "50px",
                            }}>
                                <p style={{
                                    // chỉ xuất hiện khi submit đáp án
                                    display: isSubmitted ? "block" : "none",
                                    fontSize: "24px",
                                    fontWeight: "bold",
                                    // border màu đỏ nếu trả lời sai màu xanh nếu trả lời đúng
                                    border: answer.toLowerCase() === flashcards[question].word.toLowerCase() ? "1px dotted green" : "1px dotted red",
                                }}>Đáp án {flashcards[question].word}</p>
                            </div>

                            <TextField id="outlined-basic" label="Outlined" variant="outlined"
                                value={answer}
                                onKeyUp={(e) => {
                                    if (e.key === "Enter") {
                                        handleSubmitAnswer();
                                    }
                                }}
                                onChange={(e) => {
                                    setAnswer(e.target.value);
                                }}
                                autoComplete='off'
                            />
                        </div>

                    )
                    
                }
                {
                    progressPercent === 100 ? <ShowResult /> : null
                }
            </div>
        </div>
    )
}

export default ReviewFlashcard