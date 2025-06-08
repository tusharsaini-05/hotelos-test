"use client"

import { useQuery } from "@apollo/client"
import { GET_ROOMS } from "@/graphql/room/queries"
import { useMemo } from "react"

interface Room {
  id: string
  roomNumber: string
  floor: number
}

export function useRoomMap(hotelId?: string) {
  const { data, loading, error } = useQuery(GET_ROOMS, {
    variables: { hotelId },
    skip: !hotelId,
  })

  const roomNumberMap = useMemo(() => {
    const map: Record<string, string> = {}
    if (data?.rooms) {
      for (const room of data.rooms as Room[]) {
        map[room.id] = room.roomNumber
      }
    }
    return map
  }, [data])

  const floorMap = useMemo(() => {
    const map: Record<string, number> = {}
    if (data?.rooms) {
      for (const room of data.rooms as Room[]) {
        map[room.id] = room.floor
      }
    }
    return map
  }, [data])

  return {
    roomNumberMap,
    floorMap,
    loading,
    error,
  }
}
