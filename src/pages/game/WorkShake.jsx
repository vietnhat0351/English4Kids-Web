import React, { useEffect, useState } from 'react'
import './WorkShake.css'
// chọn card-matching-bg-image.webp từ assets
import bgImage from '../../assets/workshake-bg-image.png'
import prepareBG from '../../assets/wordshake.jpg'
import bgheader from '../../assets/wordshake-header.png'

import bgMusic from '../../assets/background-music1.mp3'
import correctSound from '../../assets/ws-correct.wav'

import { FaQuestion } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'
import { PiSpeakerHighFill } from "react-icons/pi";

const WorkShake = () => {

    const [time, setTime] = useState(180); // 3 minutes countdown
    const [letters, setLetters] = useState([]);
    const [selectedWord, setSelectedWord] = useState('');
    const [words, setWords] = useState([]);
    const [points, setPoints] = useState(0);
    const [isGameActive, setIsGameActive] = useState(false);
    const [checkAnswer, setCheckAnswer] = useState('');
    const [isValidWord, setIsValidWord] = useState(false);

    const [isBackgroundMusicOn, setIsBackgroundMusicOn] = useState(false);

    useEffect(() => {
        const audio = new Audio(bgMusic);
        audio.loop = true;
        audio.volume = 0.2;
        if (isBackgroundMusicOn) {
            audio.play();
        } else {
            audio.pause();
        }

        return () => audio.pause();
    }, [isBackgroundMusicOn]);

    useEffect(() => {
        // Initialize random letters
        setLetters(generateRandomLetters());

        // Countdown timer
        const timer = setInterval(() => {
            setTime(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (time === 0) {
            alert('Game Over! Your score is: ' + points);
            handleNewGame();
        }
    }, [time]);

    const letterTables = new Map();
    // bảng 1: CPTIUOISTANCCORN
    letterTables.set(1, ['C', 'P', 'T', 'I', 'U', 'O', 'I', 'S', 'T', 'A', 'N', 'C', 'C', 'O', 'R', 'N']);
    // bảng 2: OIFSEEVCSERUOSNS
    letterTables.set(2, ['O', 'I', 'F', 'S', 'E', 'E', 'V', 'C', 'S', 'E', 'R', 'U', 'O', 'S', 'N', 'S']);
    // bảng 3: IITUSOLCSENLEFES
    letterTables.set(3, ['I', 'I', 'T', 'U', 'S', 'O', 'L', 'C', 'S', 'E', 'N', 'L', 'E', 'F', 'E', 'S']);
    // bảng 4: ATSOBANIOTCFSUBN
    letterTables.set(4, ['A', 'T', 'S', 'O', 'B', 'A', 'N', 'I', 'O', 'T', 'C', 'F', 'S', 'U', 'B', 'N']);
    // bảng 5: IOUSENORSTLSSILU
    letterTables.set(5, ['I', 'O', 'U', 'S', 'E', 'N', 'O', 'R', 'S', 'T', 'L', 'S', 'S', 'I', 'L', 'U']);
    // bảng 6: TNETSOTAENIUOSSS
    letterTables.set(6, ['T', 'N', 'E', 'T', 'S', 'O', 'T', 'A', 'E', 'N', 'I', 'U', 'O', 'S', 'S', 'S']);
    // bảng 7: ARIAPOPEHUEIRHOU
    letterTables.set(7, ['A', 'R', 'I', 'A', 'P', 'O', 'P', 'E', 'H', 'U', 'E', 'I', 'R', 'H', 'O', 'U']);
    // bảng 8: CNCOAUOSPOCUNOHM
    letterTables.set(8, ['C', 'N', 'C', 'O', 'A', 'U', 'O', 'S', 'P', 'O', 'C', 'U', 'N', 'O', 'H', 'M']);
    // bảng 9: EFICECAFCSNSSUOI
    letterTables.set(9, ['E', 'F', 'I', 'C', 'E', 'C', 'A', 'F', 'C', 'S', 'N', 'S', 'S', 'U', 'O', 'I']);
    // bảng 10: USSSAEOSINGCSIAC
    letterTables.set(10, ['U', 'S', 'S', 'S', 'A', 'E', 'O', 'S', 'I', 'N', 'G', 'C', 'S', 'I', 'A', 'C']);
    // bảng 11: XESBINORAENESSLB
    letterTables.set(11, ['X', 'E', 'S', 'B', 'I', 'N', 'O', 'R', 'A', 'E', 'N', 'E', 'S', 'S', 'L', 'B']);
    // bảng 12: LKZTICAEIISCOPOD
    letterTables.set(12, ['L', 'K', 'Z', 'T', 'I', 'C', 'A', 'E', 'I', 'I', 'S', 'C', 'O', 'P', 'O', 'D']);
    // bảng 13: ABRACADCAAUBHRTB
    letterTables.set(13, ['A', 'B', 'R', 'A', 'C', 'A', 'D', 'C', 'A', 'A', 'U', 'B', 'H', 'R', 'T', 'B']);
    // bảng 14: SLESUNSOQTAOCIUS
    letterTables.set(14, ['S', 'L', 'E', 'S', 'U', 'N', 'S', 'O', 'Q', 'T', 'A', 'O', 'C', 'I', 'U', 'S']);
    // bảng 15: SEEBENTLCEIVOLNE
    letterTables.set(15, ['S', 'E', 'E', 'B', 'E', 'N', 'T', 'L', 'C', 'E', 'I', 'V', 'O', 'L', 'N', 'E']);
    // bảng 16: USSIONNEERSAFSSN
    letterTables.set(16, ['U', 'S', 'S', 'I', 'O', 'N', 'N', 'E', 'E', 'R', 'S', 'A', 'F', 'S', 'S', 'N']);
    // bảng 17: NNERCTRTANUELSTO
    letterTables.set(17, ['N', 'N', 'E', 'R', 'C', 'T', 'R', 'T', 'A', 'N', 'U', 'E', 'L', 'S', 'T', 'O']);
    // bảng 18: ELUBEEILENOUPTSC
    letterTables.set(18, ['E', 'L', 'U', 'B', 'E', 'E', 'I', 'L', 'E', 'N', 'O', 'U', 'P', 'T', 'S', 'C']);
    // bảng 19: IESRSANSUIPCRICO
    letterTables.set(19, ['I', 'E', 'S', 'R', 'S', 'A', 'N', 'S', 'U', 'I', 'P', 'C', 'R', 'I', 'C', 'O']);
    // bảng 20: YATBELRBININETHI
    letterTables.set(20, ['Y', 'A', 'T', 'B', 'E', 'L', 'R', 'B', 'I', 'N', 'I', 'N', 'E', 'T', 'H', 'I']);

    const [selectedCellIds, setSelectedCellIds] = useState([]);

    // hàm chọn ngẫu nhiên một bảng chữ cái
    const generateRandomLetters = () => {
        const randomIndex = Math.floor(Math.random() * 20) + 1;
        return letterTables.get(randomIndex);
    };

    const checkWordValidity = async (word) => {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();

        return response.ok && data.length > 0;
    };

    const handleCellClick = (letter, index) => {
        // kiểm tra xem index đã được chọn chưa
        if (selectedCellIds.includes(index)) {
            setSelectedCellIds(selectedCellIds.filter(i => i !== index));
            setSelectedWord(selectedWord.slice(0, -1));
        } else {
            setSelectedCellIds([...selectedCellIds, index]);
            setSelectedWord(selectedWord + letter);
        }
    };

    const handleEnter = async () => {
        if (selectedWord) {
            const isValid = await checkWordValidity(selectedWord);

            if (isValid && selectedWord.length > 1) {
                if (words.includes(selectedWord)) {
                    alert('Word already exists!');
                    setSelectedWord('');
                    setSelectedCellIds([]);
                    return;
                }
                setWords([...words, selectedWord]);
                setSelectedWord('');
                setSelectedCellIds([]);
                setPoints(points + selectedWord.length); // Simple point logic

                setCheckAnswer('correct');

                const audio = new Audio(correctSound);
                // audio.volume = 0.2; 
                audio.play();
                setTimeout(() => {
                    setCheckAnswer('');
                }, 1000);

            } else {
                setCheckAnswer('invalid');
                setSelectedWord('');
                setSelectedCellIds([]);
                setTimeout(() => {
                    setCheckAnswer('');
                }, 1000);
            }
        }
    };

    const handleCancel = () => {
        setSelectedWord('');
        setSelectedCellIds([]);
    };

    const handleNewGame = () => {
        setTime(180);
        setLetters(generateRandomLetters());
        setWords([]);
        setPoints(0);
        setSelectedWord('');
        setSelectedCellIds([]);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div style={{
            backgroundColor: '#903779',
        }}>
            <IoMdClose size={35} style={{
                cursor: 'pointer',
                border: '1px solid black',
                borderRadius: '5px',
                borderColor: '#fff',
                color: '#fff',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                right: '20px',
                position: 'absolute',
            }}
                onClick={() => {
                    window.location.href = '/'
                }}
            />
            {
                isGameActive ? <div className="ws-App" style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '85% 85%',
                }}>
                    <PiSpeakerHighFill size={40} style={{
                        cursor: 'pointer',
                        position: 'relative',
                        right: '20px',
                        // top: '10px',
                        bottom: '10px', 
                        color: isBackgroundMusicOn ? 'green' : 'red',
                    }} onClick={() => {
                        setIsBackgroundMusicOn(!isBackgroundMusicOn);
                    }}/>
                    <div style={{
                        backgroundImage: `url(${bgheader})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% 100%',
                        height: '90px',
                        width: '1130px',
                        display: 'flex',
                        flexDirection: 'row',
                    }}>
                        <div style={{
                            display: 'flex',
                            flex: 6,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}><div className="time">{formatTime(time)}</div></div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            height: '100%',
                            flex: 6,
                            alignItems: 'center',
                        }}>
                            <div className="new-game-btn" onClick={handleNewGame}>New game</div>
                            {/* <div className="home-btn">Home</div> */}
                        </div>
                    </div>
                    <div className="game-area">
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '1rem',
                        }}>

                            <div className="grid">
                                {letters.map((letter, index) => (
                                    <div key={index}
                                        className={selectedCellIds.includes(index) ? 'grid-cell-clicked' : 'grid-cell'}
                                        onClick={() => handleCellClick(letter, index)}>
                                        {letter}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            width: '100%',
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%',
                                border: '1px solid #ccc',
                                width: '100%',
                                backgroundColor: '#cae0e2'
                            }}>
                                <div className="scrollable-table">
                                    <table className='ws-table'>
                                        <thead>
                                            <tr>
                                                <th>Word</th>
                                                <th>Points</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{
                                            backgroundColor: '#fff',
                                        }}>
                                            {words.map((word, index) => (
                                                <tr key={index}>
                                                    <td>{word}</td>
                                                    <td>{word.length}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {
                                    checkAnswer === 'invalid' ? <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#fff',
                                        color: 'red',
                                        height: '50px',
                                        marginBottom: '10px',
                                    }}>
                                        <FaQuestion style={{
                                            marginRight: '10px',
                                        }} />
                                        Word is not valid!
                                    </div> : <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#fff',
                                        height: '50px',
                                        marginBottom: '10px',
                                    }}>
                                        {
                                            checkAnswer === 'correct' ? <div style={{
                                                color: 'green',
                                            }}>
                                                Correct!
                                            </div> : <div>
                                                Enter a word
                                            </div>

                                        }
                                    </div>
                                }
                                <div className="selected-word">
                                    {selectedWord.toUpperCase()}
                                </div>

                                <div className="controls">
                                    <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                                    <button className="enter-btn" onClick={handleEnter}>Enter</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div> : (
                    <div style={
                        {
                            backgroundImage: `url(${prepareBG})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '85% 85%',
                            height: '100vh',
                            display: 'flex',
                            overflow: 'hidden',
                        }
                    }>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '1rem',
                            height: '100%',
                            width: '100%',
                            position: 'relative',
                            top: '180px',
                        }}>
                            <button onClick={() => {
                                setIsGameActive(true);
                                setIsBackgroundMusicOn(true);
                            }}
                                style={{
                                    padding: '10px',
                                    backgroundColor: '#2f4554',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    width: '200px',
                                    height: '50px',
                                }}
                            >Start Game</button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default WorkShake