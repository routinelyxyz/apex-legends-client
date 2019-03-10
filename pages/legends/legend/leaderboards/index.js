import { withRouter } from 'next/router';
import { platforms, statsProps, statsTitlesMap } from '../../../../helpers';

import { PlayersTable } from '../../../../components/PlayersTable';
import { Select } from '../../../../reusable/Select';
import { H3 } from '../../../../reusable/Elements';

const legendProps  = statsProps.legend;

const initialProp = 'kills';
const initialPlatform = 'all';

const LegendLeaderboardsPage = ({ legend = {}, router, data, pages, perPage = 100 }) => {
  const [platform, setPlatform] = useState(initialPlatform);
  const [prop, setProp] = useState(initialProp);
  const [isFetching, setIsFetching] = useState(false);

  const page = router.query.page != null
    ? Number(router.query.page)
    : 1;

  useEffect(() => {
    if (isFetching) return;
    const query = {};

    if (platform !== initialPlatform) query.platform = platform;
    if (prop !== initialProp) query.prop = prop;

    const href = `/leaderboards/${legend.slug}/?legendId=${legend.id}&` + qs.stringify(query);
    const as = href;

    setIsFetching(true);

    router.replace(href, as, { shallow: false })
      .then(_ => setIsFetching(false))
      .catch(console.log);

  }, [platform, prop]);

  return (
    <div>
      <div>
        <label>
          <H3>Platform</H3>
          <Select
            value={platform}
            disabled={isFetching}
            active={platform !== initialPlatform}
            onChange={e => setPlatform(
              e.target.value
            )}
          >
            {platforms.map(platform => (
              <option
                value={platform.value}
                key={platform.value}
              >
                {platform.name}
              </option>
            ))}
          </Select>
        </label>
        <label>
          <H3>Property</H3>
          <Select
            value={prop}
            disabled={isFetching}
            active={prop !== initialProp}
            onChange={e => setProp(
              e.target.value
            )}
          >
            {legendProps.map(prop => (
              <option
                value={prop}
                key={prop}
              >
                {statsTitlesMap[prop]}
              </option>
            ))}
          </Select>
        </label>
      </div>
      <PlayersTable
        data={data}
        prop={prop}
        renderRank={index => (index + 1) + (page - 1) * perPage}
      />
    </div>
  )
}

LegendLeaderboardsPage.getInitialProps = async ({ query }) => {
  const { slug, id } = query;
  
  return {};
}

export default withRouter(LegendLeaderboardsPage);