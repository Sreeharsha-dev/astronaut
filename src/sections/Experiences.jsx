import { Timeline } from "../components/Timeline";
import { professionalExperience, academicExperience } from "../constants";

const Experiences = () => {
  return (
    <div className="w-full">
      <Timeline 
        professionalExperience={professionalExperience} 
        academicExperience={academicExperience} 
      />
    </div>
  );
};

export default Experiences;