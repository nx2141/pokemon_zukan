import "./App.css";
import React, { useEffect, useState } from "react";
import { getAllPokemon, getPokemon } from "./utils/pokemon.js";
import Card from "./components/Card";
import Navbar from "./components/Navbar";

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextURL, setNextURL] = useState("");
  const [prevURL, setPrevURL] = useState("");
  

  useEffect(() => {
    const fetchPokemonData = async () => {
      //すべてのポケモンデータ取得
      let res = await getAllPokemon(initialURL);
      //各ポケモンの詳細データ取得
      loadPokemon(res.results);
      setNextURL(res.next);
      setPrevURL(res.previous);
    };
    fetchPokemonData();
    setLoading(false);
  }, []);

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  // console.log(pokemonData);


  const handleNextPage = async() => {
    setLoading(true);
    let data = await getAllPokemon(nextURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handlePrevPage = async() => {
    setLoading(true);
    let data = await getAllPokemon(prevURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <p className="waitTxt">すこしまってね</p>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <div className="btn">
              <button onClick={handlePrevPage} disabled={prevURL === null}>もどる</button>
              <button onClick={handleNextPage} disabled={nextURL === null}>つぎへ</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
