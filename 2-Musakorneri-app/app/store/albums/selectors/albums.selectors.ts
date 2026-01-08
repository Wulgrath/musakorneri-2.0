// import { createSelector } from '@reduxjs/toolkit'
// import { RootState } from '../../index'
// import { albumsAdapter } from '../albumsSlice'

// // Get the selectors from the adapter
// const adapterSelectors = albumsAdapter.getSelectors((state: RootState) => state.albums)

// // Export the basic selectors
// export const selectAllAlbums = adapterSelectors.selectAll
// export const selectAlbumById = adapterSelectors.selectById
// export const selectAlbumIds = adapterSelectors.selectIds
// export const selectAlbumEntities = adapterSelectors.selectEntities
// export const selectAlbumTotal = adapterSelectors.selectTotal

// // Custom selectors
// export const selectAlbumsByArtist = createSelector(
//   [selectAllAlbums, (state: RootState, artist: string) => artist],
//   (albums, artist) => albums.filter(album => album.artist === artist)
// )

// export const selectAlbumsLoading = (state: RootState) => state.albums.loading
// export const selectAlbumsError = (state: RootState) => state.albums.error
