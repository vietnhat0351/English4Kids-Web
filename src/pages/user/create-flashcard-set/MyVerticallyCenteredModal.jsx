import { useEffect, useState } from 'react';
import customFetch from '../../../utils/customFetch';
import { Button, CircularProgress, TextField } from '@mui/material';

// import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './MyVerticallyCenteredModal.css';

function MyVerticallyCenteredModal(props) {
  const { flashcards, choosingFlashcard, setFlashcards, keyword, show, onHide } = props;

  const updatedFlashcards = [...flashcards];
  const flashcard = updatedFlashcards[choosingFlashcard];

  const [keywordState, setKeywordState] = useState(keyword);

  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages(keyword);
  }, [keyword]);

  const fetchImages = (keyword) => {
    customFetch.get(`/api/v1/pixabay/search?query=${keyword}`)
      .then((response) => {
        const imagesURL = response.data.hits.map((image) => image.webformatURL);
        setImages(imagesURL);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleChooseImage = (index) => {
    updatedFlashcards[choosingFlashcard] = {
      ...updatedFlashcards[index],
      ...flashcard,
      image: images[index],
    }
    setFlashcards(updatedFlashcards);
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    const modal = document.getElementById('myModal');
    if (event.target === modal) {
      onHide();
    }
  }

  return (

    <div id="myModal" className="modal"
      style={{
        display: show ? 'block' : 'none'
      }}
    >

      <div className="modal-content">
        <div className="modal-header">
          <span className="close" onClick={
            () => {
              onHide();
            }
          }>&times;</span>
          <h2>Choose an image for Flashcard </h2>
        </div>
        <div className="modal-body">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingBottom: '1rem',
          }}>
            <TextField id="outlined-basic" label="Word" variant="outlined"
              value={keywordState && keywordState !== '' ? keywordState : keyword}
              onChange={(event) => {
                setKeywordState(event.target.value);
              }}
              style={{
                width: '80%'
              }}
            />
            <Button variant="contained" onClick={() => fetchImages(keywordState)}>Find</Button>
          </div>
          {
            images.length > 0 ? (<div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}>
              {
                images.map((image, index) => (
                  <img key={index} src={image} alt="Ảnh" style={{ width: '100%', cursor: 'pointer' }}
                    // onClick={handleChooseImage(index)}
                    onClick={() => {
                      handleChooseImage(index);
                      setImages([]);
                      onHide();
                    }}
                  />
                ))
              }
            </div>) : (<CircularProgress />)
          }
        </div>
      </div>

    </div>
  );
}

export default MyVerticallyCenteredModal;