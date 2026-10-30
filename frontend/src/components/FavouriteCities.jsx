import { Heart, Trash2 } from "lucide-react";

export default function FavouriteCities({ favourites, onSelectCity, onRemove }) 
{
  return <section className="list-card favourites-card"><
    div className="section-heading"><div><p className="eyebrow">Saved places</p><h2>Favourite cities</h2></div><Heart size={19} /></div>{favourites.length ? favourites.map((favourite) => <div className="list-row" key={favourite.id}><button onClick={() => onSelectCity(favourite.city)}>{favourite.city}</button><button className="delete-button" onClick={() => onRemove(favourite.id)} aria-label={`Remove ${favourite.city}`}><Trash2 size={16} /></button></div>) : <p className="list-empty">Tap the heart to save a city.</p>}</section>;
}
