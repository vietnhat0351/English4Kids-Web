import React, { useEffect, useRef, useState } from 'react'
import customFetch from '../../../../utils/customFetch';
import { useParams } from 'react-router-dom';
import { Box, Button, IconButton, LinearProgress, Paper, TextField, Tooltip, Typography } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { IoMdClose } from 'react-icons/io';
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

const ReviewFlashcard = () => {
    const flashcardSetId = useParams().flashcardSetId;
    const [question, setQuestion] = useState(0);
    const [total, setTotal] = useState(0);
    const [flashcards, setFlashcards] = useState([]);
    const progressPercent = total > 0 ? (question / total) * 100 : 0;
    const [answer, setAnswer] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [inCorrectFlashcards, setInCorrectFlashcards] = useState([]);

    const [isAnswerCorrectSubmitted, setIsAnswerCorrectSubmitted] = useState(false);
    const [isWrongAnswerSubmitted, setIsWrongAnswerSubmitted] = useState(false);

    const answerInput = useRef(null);

    useEffect(() => {
        if (answerInput.current) {
            answerInput.current.focus();
        }
    }, [answer])


    const handleSubmitAnswer = () => {
        setIsSubmitted(true);
        if (answer.toLowerCase() === flashcards[question].word.toLowerCase()) {
            setIsAnswerCorrectSubmitted(true);
            setTimeout(() => {
                setQuestion(question + 1);
                setAnswer("");
                setIsSubmitted(false);
                setIsAnswerCorrectSubmitted(false);

            }, 1000);

        } else {
            setTimeout(() => {
                setIsWrongAnswerSubmitted(true);
            }, 10);
        }
    }

    const handleContinue = () => {
        setQuestion(question + 1);
        setInCorrectFlashcards([...inCorrectFlashcards, flashcards[question]]);
        setAnswer("");
        setIsSubmitted(false);
        setIsWrongAnswerSubmitted(false);
    }

    useEffect(() => {
        const handleKeyUp = (event) => {
            if (event.key === 'Enter') {
                handleContinue();
            }
        };

        if (isWrongAnswerSubmitted) {
            document.addEventListener('keyup', handleKeyUp);
        }

        return () => {
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [isWrongAnswerSubmitted]);

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
                    {
                        question - inCorrectFlashcards.length === total ? <Button variant="contained" color="primary" onClick={() => {
                            setQuestion(0);
                            setInCorrectFlashcards([]);
                        }}>Làm Lại Từ Đầu</Button> : <Button variant="contained" color="primary" onClick={() => {
                            setQuestion(0);
                            setFlashcards(inCorrectFlashcards);
                            setTotal(inCorrectFlashcards.length);
                            setInCorrectFlashcards([]);
                        }}>Làm Lại Câu Sai</Button>
                    }

                </div>
            </div>
        )
    }

    function LinearProgressWithLabel(props) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress
                        sx={{ width: '100%', height: '7px' }}
                        variant="determinate"
                        color='secondary'
                        {...props}
                    />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >{`${Math.round(props.value)}%`}</Typography>
                </Box>
            </Box>
        );
    }
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
        }}>
            <div style={{
                width: '100%',
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                }}>
                    <div style={{
                        flex: 1,
                    }}>

                    </div>
                    <div style={{
                        flex: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <p>
                            {question} / {total}
                        </p>
                    </div>
                    <div style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "flex-end",
                    }}>
                        <IoMdClose size={35} style={{
                            cursor: 'pointer',
                            border: '1px solid black',
                            borderRadius: '5px',
                            borderColor: '#fff',
                            color: '#fff',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        }}
                            onClick={() => {
                                window.location.href = `/flashcard/${flashcardSetId}`;
                            }}
                        />
                    </div>
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Box sx={{
                        width: '95%',
                    }}>
                        <LinearProgressWithLabel value={progressPercent} />
                    </Box>
                </div>
            </div>
            <Paper style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "5rem",
                width: '70%',
                height: '70%',
            }}>
                {
                    flashcards[question] && (
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            flex: 1,
                        }}>
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row",
                                gap: "10px",
                                padding: "10px",
                                border: "1px solid black",
                            }}>
                                <div>
                                    {flashcards[question].meaning}
                                </div>
                                <img src={flashcards[question].image} alt="flashcard" style={{
                                    width: "300px",
                                    height: "300px",
                                }} />
                            </div>
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "50px",
                            }}>
                            </div>
                            <div style={{
                                display: "flex",
                                width: "70%",
                                flexDirection: "column",
                                visibility: isAnswerCorrectSubmitted ? 'visible' : 'hidden',
                                gap: '20px',
                                color: 'green',
                                position: 'absolute',
                                justifyContent: 'center',
                                alignItems: 'center',
                                top: '55%',
                            }}>
                                <p>Chính Xác! 🥳</p>
                                <div style={{
                                    display: 'flex',
                                    gap: '20px',
                                    fontSize: '30px',
                                    fontWeight: 'bold',
                                    width: '70%',
                                    textAlign: 'start',
                                    border: '2px solid green',
                                    padding: '17px',
                                    borderRadius: '5px',
                                }}>
                                    <FaCheck /><span>{answer}</span>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                flex: 1,
                                gap: '20px',
                                visibility: isWrongAnswerSubmitted ? 'visible' : 'hidden',
                                position: 'absolute',
                                top: '55%',
                                width: '70%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}>
                                <div style={{
                                    color: 'red',
                                    fontSize: '30px',
                                    fontWeight: 'bold',
                                    width: '70%',
                                    textAlign: 'start',
                                    border: '1px solid red',
                                    padding: '17px',
                                    borderRadius: '5px',
                                    gap: '20px',
                                    display: 'flex',
                                }}><FaXmark /><span>{answer}</span></div>

                                <div style={{
                                    color: 'green',
                                    fontSize: '30px',
                                    fontWeight: 'bold',
                                    width: '70%',
                                    textAlign: 'start',
                                    border: '1px solid green',
                                    padding: '17px',
                                    borderRadius: '5px',
                                    gap: '20px',
                                    display: 'flex',
                                }}><FaCheck /><span>{flashcards[question].word}</span></div>
                            </div>

                            <TextField id="answer-input" variant="outlined"
                                placeholder='Nhập Câu Trả Lời Tiếng Anh'
                                inputRef={answerInput}
                                sx={{
                                    width: '70%',
                                    visibility: isSubmitted ? 'hidden' : 'visible',
                                }}
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
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "20px",
                                visibility: isWrongAnswerSubmitted ? 'visible' : 'hidden',
                                position: 'fixed',
                                height: '50px',
                                bottom: '0',
                            }}>
                                <span>Nhấn phím Enter để tiếp tục</span>
                            </div>
                        </div>

                    )
                }
                {
                    progressPercent === 100 ? <ShowResult /> : null
                }
            </Paper>
        </div>
    )
}

export default ReviewFlashcard