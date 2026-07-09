import React from 'react';
import My_wrapper from "./My_wrapper";
import { type Movie } from "./MovieData";
import './My.css';


interface MyProps {
  onMovieClick: (movie: Movie) => void;
  isSaved: boolean;
  activeTab: string;
}

const My: React.FC<MyProps> = ({ onMovieClick, isSaved, activeTab }) => {
  return (
    <>
      <My_wrapper isSaved={isSaved} activeTab={activeTab} 
                  onMovieClick={onMovieClick} />
    </>
  );
};
export default My;