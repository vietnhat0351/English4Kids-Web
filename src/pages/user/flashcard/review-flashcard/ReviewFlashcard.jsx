import React, { useEffect, useState } from 'react'
import customFetch from '../../../../utils/customFetch';
import { useParams } from 'react-router-dom';
import { Box, Button, IconButton, LinearProgress, TextField, Tooltip, Typography } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import './ReviewFlashcard.css';
import { IoMdClose } from 'react-icons/io';

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
        <div>
            <div>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    // color: '#fff',
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
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "5rem",
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

                            <TextField id="outlined-basic" label="Câu Trả Lời" variant="outlined"
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