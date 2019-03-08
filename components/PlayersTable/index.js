import css from './style.scss';

const avatar = 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon3379.jpg?image=c_scale,w_38&v=1518361200';

export const PlayersTable = ({ data, prop = 'kills', propName }) => {
  return (
    <table className={css.players_table}>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Player</th>
          <th>{propName}</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td className={css.player}>
              <img
                src={avatar}
                className={css.avatar}
              />
              {row.player.name}
            </td>
            <td>{row[prop]}</td>
          </tr> 
        ))}
      </tbody>
    </table>
  )
}