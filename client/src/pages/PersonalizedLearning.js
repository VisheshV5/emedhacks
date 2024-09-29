import React from "react";
import { checkSymptoms } from "../services/user.service";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const PersonalizedLearning = () => {
  const { user } = useSelector((state) => state.auth);
  const submit = async (data) => {
    try {
      const res = await checkSymptoms(user.id, [
        "sneezing",
        "coughing",
        "fever",
        "sore throat",
      ]);
      console.log(res);
      toast.success("Preferences created successfully");
    } catch (err) {
      console.log(err);
      toast.error("Error creating preferences");
    }
  };
  return <button onClick={submit}>Submit</button>;
};

export default PersonalizedLearning;
