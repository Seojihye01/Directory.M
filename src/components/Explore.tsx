import Explore_wrapper from "./Explore_wrapper";
import { type Movie } from "./MovieData";



interface ExploreProps {
    onMovieClick: (movie: Movie) => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

function Explore({ onMovieClick, activeTab, setActiveTab }: ExploreProps){
    return(
        <>
        <Explore_wrapper onMovieClick={onMovieClick} 
                         activeTab={activeTab} 
                         setActiveTab={setActiveTab}/>
        </>
    );
}

export default Explore;