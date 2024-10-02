import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react'
import { FaImage, FaTrash } from "react-icons/fa6";
import MyVerticallyCenteredModal from './MyVerticallyCenteredModal';

const CreateFlashcardForm = (props) => {
    const { flashcards, setFlashcards, index, setModalShow, setChoosingFlashcard, setKeyword } = props;
    const updatedFlashcards = [...flashcards];
    const flashcard = updatedFlashcards[index];

    const handleChooseImage = () => {
        setModalShow(true);
        setKeyword(flashcard.word);
        setChoosingFlashcard(index);
    }

    return (
        <div key={index} style={{
            // border: '1px solid black',
            backgroundColor: 'lightgray',
            borderRadius: '0.5rem',
            margin: '0.5rem',
        }}>
            {/* <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                choosingFlashcard={choosingFlashcard}
                flashcards={flashcards ? flashcards : []}
                setFlashcards={setFlashcards}
                keyword={keyword}
            /> */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: '1rem',
            }}>
                <h3>{index + 1}</h3>
                <FaTrash
                    onClick={() => {
                        console.log("Deleted flashcard at index", index);
                        updatedFlashcards.splice(index, 1);
                        console.log(updatedFlashcards);
                        setFlashcards(updatedFlashcards);
                    }}
                    style={{
                        cursor: 'pointer',
                    }}
                />
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                borderTop: '1px solid black',
                padding: '0.5rem',
            }}>
                {/* <label htmlFor={`flashcardQuestion${index}`}>Thuật ngữ</label> */}
                <TextField id="standard-basic" label="Thuật Ngữ" variant="standard" onChange={(e) => {
                    updatedFlashcards[index] = {
                        // ...updatedFlashcards[index],
                        ...flashcard,
                        word: e.target.value
                    }
                    setFlashcards(updatedFlashcards);
                }}
                    value={flashcard.word}
                    style={{
                        width: '40%'
                    }}
                />
                <TextField id="standard-basic" label="Định Nghĩa" variant="standard" onChange={(e) => {
                    updatedFlashcards[index] = {
                        // ...updatedFlashcards[index],
                        ...flashcard,
                        meaning: e.target.value
                    }
                    setFlashcards(updatedFlashcards);
                }}
                    style={{
                        width: '40%'
                    }}
                    value={flashcard.meaning}
                />
                {
                    flashcard.image ? (
                        <img src={flashcard.image} alt="Ảnh"
                            style={{ 
                                maxHeight: '100px',
                            }}
                            onClick={handleChooseImage} />
                    ) : (
                        <div style={{
                            border: '1px dotted black',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                        }}
                            onClick={handleChooseImage}
                        >
                            <FaImage />
                            <h6>HÌNH ẢNH</h6>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

const CreateFlashcardSet = () => {

    const [modalShow, setModalShow] = React.useState(false);

    const [choosingFlashcard, setChoosingFlashcard] = useState(null);
    const [keyword, setKeyword] = useState('');

    const [flashcardSet, setFlashcardSet] = useState({});
    // const [flashcardQuantity, setFlashcardQuantity] = useState(3);
    const [flashcards, setFlashcards] = useState([{ word: '', meaning: '' }]);

    const { enqueueSnackbar } = useSnackbar();
    const handleClickVariant = (variant, message) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    const handleSaveFlashcardSet = () => {
        console.log("Saved flashcard set");
        const token = localStorage.getItem('accessToken');
        axios.post(`${process.env.REACT_APP_API_URL}/api/v1/flashcards/create-flashcard-set`, {
            name: flashcardSet.name,
            description: flashcardSet.description,
            image: flashcardSet.image,
            flashcards: flashcards
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            console.log(response.data);
            if (response.status === 200) {
                handleClickVariant('success', 'Tạo bộ flashcard thành công');
            } else {
                handleClickVariant('error', 'Tạo bộ flashcard thất bại');
            }
        }).catch((error) => {
            console.error(error);
        })
    }

    return (
        <div style={{
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <h1>Tạo Bộ Flashcard</h1>
            <div>
                <label htmlFor="flashcardSetName">Tên bộ Flashcard</label>
                <input type="text" id="flashcardSetName" value={flashcardSet.name} onChange={(e) => setFlashcardSet({
                    ...flashcardSet,
                    name: e.target.value
                })} />
            </div>
            <div>
                <label htmlFor="flashcardSetDescription">Mô tả</label>
                <textarea id="flashcardSetDescription" value={flashcardSet.description} onChange={(e) => setFlashcardSet({
                    ...flashcardSet,
                    description: e.target.value
                })} />
            </div>
            {
                // flashcardQuantity > 0 && Array.from({ length: flashcardQuantity }).map((_, index) => (
                //     <CreateFlashcardForm key={index} flashcards={flashcards} setFlashcards={setFlashcards} index={index} />
                // ))
                flashcards.map((_, index) => (
                    <CreateFlashcardForm
                        key={index}
                        flashcards={flashcards}
                        setFlashcards={setFlashcards}
                        index={index}
                        setModalShow={setModalShow}
                        setChoosingFlashcard={setChoosingFlashcard}
                        setKeyword={setKeyword}
                    />
                ))
            }
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                margin: '1rem 0',
            }}>
                <Button variant="contained" color="primary" onClick={() => {
                    setFlashcards([...flashcards, { word: '', meaning: '' }]);
                }}>Thêm Flashcard</Button>
                <Button variant="contained" color="primary" onClick={handleSaveFlashcardSet}>Tạo bộ Flashcard</Button>

                <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    choosingFlashcard={choosingFlashcard}
                    flashcards={flashcards ? flashcards : []}
                    setFlashcards={setFlashcards}
                    keyword={keyword}
                />
            </div>
        </div>
    )
}

export default CreateFlashcardSet