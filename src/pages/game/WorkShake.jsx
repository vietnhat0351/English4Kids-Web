import React, { useEffect, useState } from 'react'
import './WorkShake.css'
// chọn card-matching-bg-image.webp từ assets
import bgImage from '../../assets/card-matching-bg-image.webp'

const WorkShake = () => {

    const [time, setTime] = useState(180); // 3 minutes countdown
    const [letters, setLetters] = useState([]);
    const [selectedWord, setSelectedWord] = useState('');
    const [words, setWords] = useState([]);
    const [points, setPoints] = useState(0);

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

            if (isValid) {
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
            } else {
                alert('Word is not valid!');
                setSelectedWord('');
                setSelectedCellIds([]);
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
        <div className="ws-App" style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
        }}>
            <div className="game-area">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1rem',
                    height: '100%',
                    width: '100%',
                }}>
                    <div className="time">{formatTime(time)}</div>
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
                        justifyContent: 'space-between',
                        paddingBottom: '2rem',
                        borderBottom: '1px solid #ccc',
                    }}>
                        <div className="new-game-btn" onClick={handleNewGame}>New game</div>
                        <div className="home-btn">Home</div>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        border: '1px solid #ccc',
                        width: '100%',
                    }}>
                        <div className="scrollable-table">
                            <table className='ws-table'>
                                <thead>
                                    <tr>
                                        <th>Word</th>
                                        <th>Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {words.map((word, index) => (
                                        <tr key={index}>
                                            <td>{word}</td>
                                            <td>{word.length}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

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


        </div>
    )
}

export default WorkShake