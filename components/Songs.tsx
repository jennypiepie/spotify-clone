import { usePlaylistContext } from "../contexts/PlaylistContext"

const Songs = () => {
    const { playlistContextState: { selectedPlaylist } } = usePlaylistContext()
    
    if (!selectedPlaylist) return null
    
  return (
    <div>Songs</div>
  )
}

export default Songs