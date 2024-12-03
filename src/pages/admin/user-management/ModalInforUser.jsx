import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import customFetch from "../../../utils/customFetch";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #ffffff",
  boxShadow: 24,
  p: 4,
  borderRadius: "20px",
};
const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };
const ModalInforUser = ({ open, handleClose, data }) => {
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    console.log("data", data);

    const response = async () => {
      try {
        const res = await customFetch.get("/api/v1/user/progress/" + data.id);
        console.log("response", res.data);
        setUserInfo(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    response();
    // setUserInfo(response.data);
  }, [data]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {data && userInfo && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              height: "100%",
              gap: "20px",
            }}
          >
            <div className="profile-avatar">
              <div className="profile-avatar-image">
                <img
                  src={data.avatar}
                  alt="avatar"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <div className="profile-avatar-info">
                <div className="profile-avatar-info-name">
                  {userInfo.firstName + " " + userInfo.lastName}
                </div>
                <p>{userInfo.email}</p>
                <p>{"Last learning date : " + formatDate(data.lastLearningDate)}</p>
              </div>
            </div>

            <div
              style={{
                width: "70%",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  fontSize: "25px",
                  fontWeight: "bold",
                }}
              >
                Progress
              </div>
              <div className="profile-info-container">
                <div className="profile-info">
                  <img
                    src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/fire.png"
                    width={60}
                    height={60}
                    alt=""
                  />
                  <div>
                    <div>
                      <div
                        style={{
                          fontSize: "30px",
                          fontWeight: "bold",
                        }}
                      >
                        {data.streak + " "}
                      </div>{" "}
                      Day streak{" "}
                    </div>
                  </div>
                </div>
                <div className="profile-info">
                  <img
                    src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/MedalProfile.png"
                    width={60}
                    height={60}
                    alt=""
                  />
                  <div>
                    <div>
                      <div
                        style={{
                          fontSize: "30px",
                          fontWeight: "bold",
                        }}
                      >
                        {userInfo.totalLessonsLearned + " "}
                      </div>{" "}
                      Lesson{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="profile-info-container">
                <div className="profile-info">
                  <img
                    src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/thunder.png"
                    width={60}
                    height={60}
                    alt=""
                  />
                  <div>
                    <div>
                      <div
                        style={{
                          fontSize: "30px",
                          fontWeight: "bold",
                        }}
                      >
                        {data.totalPoints + " "}
                      </div>{" "}
                      Total Points{" "}
                    </div>
                  </div>
                </div>
                <div className="profile-info">
                  <img
                    src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/dictionary.png"
                    width={60}
                    height={60}
                    alt=""
                  />
                  <div>
                    <div>
                      <div
                        style={{
                          fontSize: "30px",
                          fontWeight: "bold",
                        }}
                      >
                        {userInfo.totalVocabulariesLearned + " "}
                      </div>{" "}
                      Vocabulary{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default ModalInforUser;
