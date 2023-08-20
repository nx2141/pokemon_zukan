import React, { useEffect, useState } from "react";
import "./Card.css";
function Card({ pokemon }) {
  const [pokemonName, setPokemonName] = useState([]);
  const [pokemonFlavor, setPokemonFlavor] = useState([]);
  const [pokemonAbilities, setPokemonAbilities] = useState([]);
  const loadPokemonAbilities = async (abilities) => {
    const promises = abilities.map(async (abilityObj) => {
      let response = await fetch(abilityObj.ability.url);
      let result = await response.json();
      let jaAbility = result.names.find(
        (name) => name.language.name === "ja"
      ).name;
      return jaAbility;
    });

    const allAbilities = await Promise.all(promises);
    setPokemonAbilities(allAbilities);
  };
  useEffect(() => {
    loadPokemonAbilities(pokemon.abilities);
  }, []);

  //複数個になると変わる部分
  let pokemonNameDetail = pokemon.species.url;
  const loadPokemonName = async (data) => {
    let response = await fetch(data);
    let result = await response.json();
    let jaName = result.names.find((name) => name.language.name === "ja").name;
    setPokemonName(jaName);
  };

  useEffect(() => {
    loadPokemonName(pokemonNameDetail);
  }, []);

  //Flavor
  let pokemonFlavorDetail = pokemon.species.url;
  const loadPokemonFlavor = async (data) => {
    let response = await fetch(data);
    let result = await response.json();
    let jaFlavor = result.flavor_text_entries.find(
      (entry) => entry.language.name === "ja-Hrkt"
    ).flavor_text;
    setPokemonFlavor(jaFlavor);
  };

  useEffect(() => {
    loadPokemonFlavor(pokemonFlavorDetail);
  }, []);

  //対応表
  const typeMapping = {
    normal: "ノーマル",
    fire: "ほのお",
    water: "みず",
    electric: "でんき",
    grass: "くさ",
    ice: "こおり",
    fighting: "かくとう",
    poison: "どく",
    ground: "じめん",
    flying: "ひこう",
    psychic: "エスパー",
    bug: "むし",
    rock: "いわ",
    ghost: "ゴースト",
    dragon: "ドラゴン",
    dark: "あく",
    steel: "はがね",
    fairy: "フェアリー",
  };

  return (
    <div className="card">
      <div className="cardImg">
        <div className="imageContainer">
          <img
            className="defaultImage"
            src={pokemon.sprites.front_default}
            alt="Front Default"
          ></img>
          <img
            className="hoverImage"
            src={pokemon.sprites.back_default}
            alt="Back Default"
          ></img>
        </div>
      </div>
      <h3 className="cardName">{pokemonName}</h3>
      <div className="cardTypes">
        {pokemon.types.map((type) => {
          const japaneseType = typeMapping[type.type.name] || type.type.name; // 対応する日本語がない場合は英語名を使用
          return (
            <div key={type.type.name}>
              <span className="typeName">{japaneseType}</span>
            </div>
          );
        })}
      </div>
      <p className="flavor">{pokemonFlavor}</p>
      <div className="cardInfo">
        <div className="cardData">
          <p className="title">
            おもさ：{pokemon.weight}kg / たかさ：{pokemon.height}m
          </p>
        </div>
        <div className="cardData">
          <p className="title">とくせい：{pokemonAbilities.join('、')}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
