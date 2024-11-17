import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import customFetch from '../../../../utils/customFetch';
import { Button, Paper } from '@mui/material';
// const [flashcardSet, setFlashcardSet] = useState({});
import bgImage from '../../../../assets/card-matching-bg-image.webp';

const CardMatchingGame = () => {
    const [cards, setCards] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [time, setTime] = useState(0);
    const [isGameActive, setIsGameActive] = useState(false);
    const flashcardSetId = useParams().flashcardSetId;

    const [count, setCount] = useState(0);

    useEffect(() => {
        let timer
        if (isGameActive) {
            timer = setInterval(() => {
                setTime(prevTime => prevTime + 10); // Cập nhật mỗi 10 mili giây
            }, 10);
        }

        return () => clearInterval(timer);
    }, [isGameActive]);

    useEffect(() => {
        customFetch.get(`/api/v1/flashcards/get-flashcard-set/${flashcardSetId}`)
            .then(response => {
                console.log(response.data);
                let c = [];
                response.data.flashcards.forEach(flashcard => {
                    c = [...c, {
                        id: flashcard.id,
                        word: flashcard.word,
                        type: 'front'
                    }, {
                        id: flashcard.id,
                        meaning: flashcard.meaning,
                        image: flashcard.image,
                        type: 'back'
                    }]
                });
                c.sort(() => Math.random() - 0.5);
                setCards(c);
                console.log(c);
            })
            .catch(error => {
                console.error(error);
            })
    }, [flashcardSetId])

    useEffect(() => {
        let timer;
        if (isGameActive) {
            timer = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isGameActive]);

    useEffect(() => {
        if (matchedCards.length === cards.length) {
            setIsGameActive(false);
        }
    }, [matchedCards, cards.length]);

    function handleCardClick(cardId) {

        if (count === cards.length / 2) {
            setIsGameActive(false);
        }

        if (selectedCards.length === 2 || matchedCards.includes(cardId)) {
            return;
        }

        if (selectedCards.length === 1 && selectedCards[0] === cardId) {
            setSelectedCards([]);
            return;
        }

        const newSelectedCards = [...selectedCards, cardId];
        setSelectedCards(newSelectedCards);

        if (newSelectedCards.length === 2) {
            const [firstCardId, secondCardId] = newSelectedCards;
            if (cards[firstCardId].id === cards[secondCardId].id && cards[firstCardId].type !== cards[secondCardId].type) {
                setCount(count + 1);
                setMatchedCards([...matchedCards, firstCardId, secondCardId]);
                setSelectedCards([]);
            }
            else {
                setTimeout(() => {
                    setSelectedCards([]);
                }, 1000);
            }

        }
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        const miliseconds = Math.floor((time % 1000) / 10);

        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(miliseconds).padStart(2, '0')}`;
    };

    return (
        <div style={styles.cardMatchingGame}>
            {
                isGameActive === false ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                        color: 'black',
                        gap: '20px',
                    }}>
                        <h1>Bạn đã sẵn sàng?</h1>
                        <p style={{
                            maxWidth: '300px',
                            textAlign: 'center',
                        }}>
                            Hãy ghép tất cả thuật ngữ với định nghĩa của chúng nhanh nhất có thể!
                        </p>
                        <Button variant="contained" color="primary" onClick={() => {
                            setTime(0);
                            setMatchedCards([]);
                            setSelectedCards([]);
                            setIsGameActive(true);
                        }}>Bắt đầu</Button>
                    </div>
                ) : (
                    <div><div style={styles.timer}>Thời Gian: {formatTime(time)}</div>
                        <div style={styles.grid}>
                            {cards.map((card, index) => (
                                <div
                                    key={index}
                                    style={{
                                        ...styles.card,
                                        visibility: matchedCards.includes(index) ? 'hidden' : 'visible',
                                    }}
                                    onClick={() => handleCardClick(index)}
                                >
                                    <Paper style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '24px',
                                        border: selectedCards.includes(index) ? '3px solid green' : 'none',
                                        cursor: 'pointer',
                                        backgroundColor: '#f0f8ff',
                                    }}>
                                        {
                                            card.image ? <div style={{
                                                width: '100%',
                                                height: '100%',
                                                position: 'relative',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                fontSize: '24px',
                                            }}>
                                                <Paper style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    backgroundImage: `url(${card.image})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    filter: 'blur(0px)', // Adjust the blur level as needed
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    zIndex: 1,
                                                }}></Paper>
                                                <Paper style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Adjust the overlay color and opacity as needed
                                                    zIndex: 2,
                                                }}></Paper>
                                                <div style={{
                                                    position: 'relative',
                                                    zIndex: 3,
                                                    color: '#000', // Adjust the text color as needed
                                                }}>
                                                    {card.meaning}
                                                </div>
                                            </div> : card.word
                                        }
                                    </Paper>
                                </div>
                            ))}
                        </div></div>
                )
            }
        </div>
    );
};

const styles = {
    cardMatchingGame: {
        display: 'flex',
        flexDirection: 'column',  
        alignItems: 'center',
        padding: '1rem',
        height: '100vh',
        background: 'linear-gradient(to bottom, #A2DFF3, #B2F5A4)',
    },
    timer: {
        fontSize: '24px',
        marginBottom: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '10px',
        border: '2px solid white',
        textAlign: 'center',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 200px)',
        gridTemplateRows: 'repeat(4, 150px)',
        gap: '10px'
    },
    card: {
        width: '200px',
        height: '150px',
        perspective: '1000px',
        position: 'relative'
    },
};



export default CardMatchingGame;