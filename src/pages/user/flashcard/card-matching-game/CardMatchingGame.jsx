import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import customFetch from '../../../../utils/customFetch';
// const [flashcardSet, setFlashcardSet] = useState({});

const CardMatchingGame = () => {
    const [cards, setCards] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [time, setTime] = useState(0);
    const [isGameActive, setIsGameActive] = useState(true);

    const flashcardSetId = useParams().flashcardSetId;

    useEffect(() => {
        customFetch.get(`/api/v1/flashcards/get-flashcard-set/${flashcardSetId}`)
            .then(response => {
                console.log(response.data);
                let c = [];
                response.data.flashcards.forEach(flashcard => {
                    c = [...c, {
                        id: flashcard.id,
                        word: flashcard.word,
                    }, {
                        id: flashcard.id,
                        meaning: flashcard.meaning,
                        image: flashcard.image
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
        if (selectedCards.length === 2 || matchedCards.includes(cardId)) {
            return;
        }

        const newSelectedCards = [...selectedCards, cardId];
        setSelectedCards(newSelectedCards);

        if (newSelectedCards.length === 2) {
            const [firstCardId, secondCardId] = newSelectedCards;
            if (cards[firstCardId].id === cards[secondCardId].id) {
                setMatchedCards([...matchedCards, firstCardId, secondCardId]);
            }
            setTimeout(() => setSelectedCards([]), 1000);
        }
    }

    return (
        <div style={styles.cardMatchingGame}>
            <div style={styles.timer}>Time: {time}s</div>
            <div style={styles.grid}>
                {cards.map((card, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.card,
                            visibility: matchedCards.includes(index) ? 'hidden' : 'visible',
                            border: selectedCards.includes(index) ? '2px solid green' : '1px solid #000'
                        }}
                        onClick={() => handleCardClick(index)}
                    >
                        <div style={styles.cardFront}>
                            {
                                card.image ? <div style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: `url(${card.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    {card.meaning}
                                </div> : card.word
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    cardMatchingGame: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    },
    timer: {
        fontSize: '24px',
        marginBottom: '20px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 100px)',
        gridTemplateRows: 'repeat(4, 100px)',
        gap: '10px'
    },
    card: {
        width: '100px',
        height: '100px',
        perspective: '1000px',
        position: 'relative'
    },
    cardFront: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backfaceVisibility: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px',
        border: '1px solid #000',
        borderRadius: '8px',
        backgroundColor: '#fff'
    },
    cardBack: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backfaceVisibility: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px',
        border: '1px solid #000',
        borderRadius: '8px',
        backgroundColor: '#000',
        color: '#fff',
        transform: 'rotateY(180deg)'
    }
};



export default CardMatchingGame;