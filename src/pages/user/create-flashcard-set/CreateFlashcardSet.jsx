import { Button, Divider, IconButton, InputAdornment, InputBase, Paper, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react'
import { FaImage, FaTrash } from "react-icons/fa6";
import MyVerticallyCenteredModal from './MyVerticallyCenteredModal';
import customFetch from '../../../utils/customFetch';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import SearchIcon from '@mui/icons-material/Search';

const CreateFlashcardForm = (props) => {
    const { flashcards, setFlashcards, index, setModalShow, setChoosingFlashcard, setKeyword } = props;
    const updatedFlashcards = [...flashcards];
    const flashcard = updatedFlashcards[index];

    // const [flashcard, setFlashcard] = useState(updatedFlashcards[index]);

    const handleChooseImage = () => {
        setModalShow(true);
        setKeyword(flashcard.word);
        setChoosingFlashcard(index);
    }

    const handleDeleteFlashcard = () => {
        if (updatedFlashcards.length === 1) {
            return;
        }
        updatedFlashcards.splice(index, 1);
        setFlashcards(updatedFlashcards);
    }

    const handleSearch = async () => {
        const response = await customFetch.get(
            `/api/v1/vocabulary/find-word/${flashcard.word}`
        );
        console.log(response);
        updatedFlashcards[index] = {
            // ...updatedFlashcards[index],
            ...flashcard,
            meaning: response.data.meaning,
            phonetic: response.data.pronunciation
        }
        setFlashcards(updatedFlashcards);
    }

    const handleClear = () => {
        updatedFlashcards[index] = {
            // ...updatedFlashcards[index],
            ...flashcard,
            phonetic: '',
            meaning: '',
            word: ''
        }
        setFlashcards(updatedFlashcards);
    }

    return (
        <div key={index} style={{
            backgroundColor: "rgba(50, 145, 250, 0.3)",
            borderRadius: '0.5rem',
            margin: '0.5rem',
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: '1rem',
            }}>
                <h3>{index + 1}</h3>
                <FaTrash
                    onClick={handleDeleteFlashcard}
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
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    paddingLeft: '1rem',
                    paddingRight: '1rem',
                    gap: '1rem',
                    flex: 9
                }}>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '1rem',
                        width: '100%',
                    }}>
                        <Paper
                            sx={{
                                p: '2px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                width: '50%',
                            }}
                        >
                            <InputBase
                                placeholder="Word"
                                inputProps={{ 'aria-label': 'Word' }}
                                error={flashcard.isValidate && !flashcard.word}
                                helperText={flashcard.isValidate && !flashcard.word ? 'Vui lòng nhập từ' : ''}
                                onChange={(e) => {
                                    updatedFlashcards[index] = {
                                        // ...updatedFlashcards[index],
                                        ...flashcard,
                                        word: e.target.value
                                    }
                                    setFlashcards(updatedFlashcards);
                                }}
                                value={flashcard.word}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem'
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                            />
                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search"
                                onClick={handleSearch}
                            >
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                        <Paper
                        sx={{
                            p: '2px 4px',
                            display: 'flex',
                            alignItems: 'center',
                            width: '50%',
                        }}
                    >
                        <InputBase
                            placeholder="Phát Âm"
                            inputProps={{ 'aria-label': 'Phát Âm' }}
                            onChange={(e) => {
                                updatedFlashcards[index] = {
                                    // ...updatedFlashcards[index],
                                    ...flashcard,
                                    phonetic: e.target.value
                                }
                                setFlashcards(updatedFlashcards);
                            }}
                            value={flashcard.phonetic}
                            style={{
                                width: '50%',
                                padding: '0.5rem'
                            }}
                        />
                    </Paper>
                    </div>
                    <Paper
                        sx={{
                            p: '2px 4px',
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <InputBase
                            placeholder="Meaning"
                            inputProps={{ 'aria-label': 'Meaning' }}
                            error={flashcard.isValidate && !flashcard.meaning}
                            helperText={flashcard.isValidate && !flashcard.meaning ? 'Vui lòng nhập nghĩa' : ''}
                            onChange={(e) => {
                                updatedFlashcards[index] = {
                                    // ...updatedFlashcards[index],
                                    ...flashcard,
                                    meaning: e.target.value
                                }
                                setFlashcards(updatedFlashcards);
                            }}
                            style={{
                                width: '100%',
                                padding: '0.5rem'
                            }}
                            value={flashcard.meaning}
                        />
                    </Paper>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                    }}>

                        <IoMdClose size={35} style={{
                            cursor: 'pointer'
                        }} onClick={handleClear} />
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 3
                }}>
                    {
                        flashcard.image ? (
                            <img src={flashcard.image} alt="Ảnh"
                                style={{
                                    maxHeight: '200px',
                                    borderRadius: '5px',
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
        </div>
    )
}

const CreateFlashcardSet = () => {

    const [modalShow, setModalShow] = useState(false);

    const [choosingFlashcard, setChoosingFlashcard] = useState(null);
    const [keyword, setKeyword] = useState('');

    const [flashcardSet, setFlashcardSet] = useState({});
    // const [flashcardQuantity, setFlashcardQuantity] = useState(3);
    const [flashcards, setFlashcards] = useState([{ word: '', meaning: '', image: '', phonetic: '', isValidate: false }]);

    const { enqueueSnackbar } = useSnackbar();
    const handleClickVariant = (variant, message) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    const handleSaveFlashcardSet = async () => {
        // kiểm tra xem tên bộ flashcard có rỗng không
        if (!flashcardSet.name) {
            handleClickVariant('error', 'Vui lòng nhập tên bộ flashcard');
            return;
        }

        // kiểm tra xem có flashcard nào không có word hoặc meaning không

        let fl = flashcards.map((flashcard, index) => {
            if (!flashcard.word || !flashcard.meaning) {
                return {
                    ...flashcard,
                    isValidate: true
                }
            }
            return flashcard;
        })

        setFlashcards(fl);

        for (let i = 0; i < fl.length; i++) {
            if (fl[i].isValidate) {
                handleClickVariant('error', 'Vui lòng nhập đầy đủ thông tin cho các flashcard');
                return;
            }
        }

        customFetch.post(`/api/v1/flashcards/create-flashcard-set`, {
            name: flashcardSet.name,
            description: flashcardSet.description,
            image: flashcardSet.image,
            flashcards: flashcards
        }).then((response) => {
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
            backgroundImage: 'url("https://english-for-kids.s3.ap-southeast-1.amazonaws.com/41d186051d1991a4ebf11f8d81f438fb85eb390f669dcb48298ea8d1e24ff188.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100vh',
        }}>
            <h1>Tạo Bộ Flashcard</h1>
            <div>
                <TextField id="standard-basic" label="Tên Bộ Flashcard" variant="standard"
                    onChange={(e) => setFlashcardSet({
                        ...flashcardSet,
                        name: e.target.value
                    })} />
            </div>
            <div>
                <TextField id="standard-basic" label="Mô Tả" variant="standard" onChange={(e) => setFlashcardSet({
                    ...flashcardSet,
                    description: e.target.value
                })} />
            </div>
            {
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