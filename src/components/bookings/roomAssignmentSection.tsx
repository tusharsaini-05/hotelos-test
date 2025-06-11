'use client'

import { useState } from 'react'
import RoomGrid from './roomAssignment'
import { useHotelContext } from "@/providers/hotel-provider"
import { Booking,RoomTypeBooking } from '@/graphql/types/booking'



type Props = {
  booking: {
    roomTypeBookings?: RoomTypeBooking[]
    bookingStatus?:string
    bookingId:string

  }
}

export default function RoomAssignmentSection({ booking }: Props) {
  const [visibleBlock, setVisibleBlock] = useState<string | null>(null);
  const { selectedHotel } = useHotelContext();
 // console.log(booking.bookingId)

  return (
    <div className="space-y-4">
      {booking.roomTypeBookings?.flatMap((rtb) => {
        const totalRooms = rtb.numberOfRooms || 0;
        const assignedRoomsCount = rtb.roomIds?.length || 0;
        const unassignedRoomsCount = totalRooms - assignedRoomsCount;

        return [
          // Render assigned rooms first (without assign button)
          ...Array.from({ length: assignedRoomsCount }).map((_, idx) => {
            const blockId = `assigned-${rtb.roomType}-${idx}`;
            return (
              <div key={blockId} className="border p-4 rounded-lg space-y-2 bg-gray-50">
                <div>
                  <div className="text-gray-500 font-medium">{`Room ${idx + 1}`}</div>
                  <div className="uppercase font-semibold">{rtb.roomType}</div>
                  <div className="text-sm text-green-600 mt-1">✓ Assigned</div>
                </div>
              </div>
            );
          }),
          
          // Then render unassigned rooms (with assign button)
          ...Array.from({ length: unassignedRoomsCount }).map((_, idx) => {
            const blockId = `unassigned-${rtb.roomType}-${idx}`;
            const isVisible = visibleBlock === blockId;
            
            return (
              <div key={blockId} className="border p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-500 font-medium">{`Room ${assignedRoomsCount + idx + 1}`}</div>
                    <div className="uppercase font-semibold">{rtb.roomType}</div>
                  </div>
                  {booking.bookingStatus === 'CONFIRMED' && (
                    <button
                      onClick={() => setVisibleBlock((prev) => (prev === blockId ? null : blockId))}
                      className="text-sm px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      {isVisible ? 'Hide' : 'Assign'}
                    </button>
                  )}
                </div>

                {isVisible && selectedHotel && (
                  <div className="mt-4">
                    <RoomGrid
                      hotelId={selectedHotel?.id}
                      roomType={rtb.roomType}
                      floorCount={selectedHotel?.floorCount}
                      bookingId={booking.bookingId}
                    />
                  </div>
                )}
              </div>
            );
          })
        ];
      })}
    </div>
  );
}