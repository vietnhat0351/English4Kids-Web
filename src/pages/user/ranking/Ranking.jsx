import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import customFetch from "../../../utils/customFetch";

import "./style.css";
import { Avatar } from "@mui/material";

const Ranking = () => {
  const user = useSelector((state) => state.user);
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
              src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/medal+(1).png"
              sx={{ width: 70, height: 70 }}
            ></Avatar>
            <h4>{topRanking[1].firstName + " " + topRanking[1].lastName}</h4>
            <h5>{topRanking[1].weeklyPoints} điểm</h5>
          </div>
          <div className="r-top-1">
            <Avatar
              src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/medal.png"
              sx={{ width: 100, height: 100 }}
            ></Avatar>
            <h2>{topRanking[0].firstName + " " + topRanking[0].lastName}</h2>
            <h5>{topRanking[0].weeklyPoints} điểm</h5>
          </div>
          <div className="r-top-3">
            <Avatar
              src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/medal+(2).png"
              sx={{ width: 70, height: 70 }}
            ></Avatar>
            <h4>{topRanking[2].firstName + " " + topRanking[2].lastName}</h4>
            <h5>{topRanking[2].weeklyPoints} điểm</h5>
          </div>
        </div>
      )}
      {ranking.length > 0 && (
        <div className="r-content">
          <div className="r-content-title">
            <div>Hạng</div>
            <div>Tên</div>
            <div>Điểm</div>
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
              <div>
                {" "}
                <Avatar
                  src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/bronze-medal.png"
                  sx={{ width: 40, height: 40 }}
                />
                {index + 4}
              </div>
              <div>{userA.firstName + " " + userA.lastName}</div>
              <div>{userA.weeklyPoints}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ranking;
