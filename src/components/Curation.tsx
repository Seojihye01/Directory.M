import Curation_wrapper from "./Curation_wrapper";
import { type Movie } from "./MovieData";

interface CurationProps {
    onMovieClick: (movie: Movie) => void;
    isSaved: boolean;
    setIsSaved: React.Dispatch<React.SetStateAction<boolean>>;
}

function Curation({ onMovieClick, isSaved, setIsSaved }: CurationProps){
    return(
        <>
        <Curation_wrapper onMovieClick={onMovieClick}
                          isSaved={isSaved} 
                          setIsSaved={setIsSaved}
        />
        </>
    );
}

export default Curation;