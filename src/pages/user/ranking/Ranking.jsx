import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import customFetch from "../../../utils/customFetch";

import "./style.css";
import { Avatar } from "@mui/material";

const Ranking = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState([]);
  const [topRanking, setTopRanking] = useState([]);

  const [itMe, setItMe] = useState("r-content-body");

  useEffect(() => {
    if (user && user.profile && user.profile.id) {
      const fetchRanking = async () => {
        try {
          const data = await customFetch
            .get("/api/v1/user/get-user-ranking")
            .then((res) => {
              return res.data;
            });
          //sort by weekPoints in descending order
          data.sort((a, b) => b.weeklyPoints - a.weeklyPoints);

          setTopRanking(data.slice(0, 3));
          setRanking(data.slice(3, 9));
        } catch (error) {
          console.error("Error fetching user ranking:", error);
        } finally {
          console.log(topRanking);
          setLoading(false);
        }
      };

      fetchRanking();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="r-container">
      {topRanking.length >= 3 && (
        <div className="r-top">
          <div className="r-top-2">
            <Avatar
              src={topRanking[1].avatar}
              sx={{ width: 70, height: 70 }}
            ></Avatar>
            <Avatar
              src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/medal+(1).png"
              sx={{ width: 30, height: 30 }}
            ></Avatar>
            <h4>{topRanking[1].firstName + " " + topRanking[1].lastName}</h4>
            <p>{topRanking[1].weeklyPoints} XP</p>
          </div>

          <div className="r-top-1">
            <Avatar
              src={topRanking[0].avatar}
              sx={{ width: 70, height: 70 }}
            ></Avatar>
            <Avatar
              src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/medal.png"
              sx={{ width: 40, height: 40 }}
            ></Avatar>
            <h2>{topRanking[0].firstName + " " + topRanking[0].lastName}</h2>
            <p>{topRanking[0].weeklyPoints} XP</p>
          </div>

          <div className="r-top-3">
            <Avatar
              src={topRanking[2].avatar}
              sx={{ width: 70, height: 70 }}
            ></Avatar>
            <Avatar
              src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/medal+(2).png"
              sx={{ width: 30, height: 30 }}
            ></Avatar>
            <h4>{topRanking[2].firstName + " " + topRanking[2].lastName}</h4>
            <p>{topRanking[2].weeklyPoints} XP</p>
          </div>
        </div>
      )}
      {ranking.length > 0 && (
        <div className="r-content">
          <div className="r-content-title">
            <div>Rank</div>
            <div>Name</div>
            <div>XP Points</div>
          </div>
          {ranking.map((userA, index) => (
            <div
              key={index}
              className={
                userA.id === user.profile.id
                  ? "r-content-body-me"
                  : "r-content-body"
              }
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "center",
              }}>
                {" "}
                <Avatar
                  src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/bronze-medal.png"
                  sx={{ width: 40, height: 40 }}
                />
                {index + 4}
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "flex-start",
              }}>
                <Avatar
                  src={userA.avatar}
                  sx={{ width: 70, height: 70 }}
                ></Avatar>{" "}
                {userA.firstName + " " + userA.lastName}
              </div>
              <div>{userA.weeklyPoints}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ranking;
