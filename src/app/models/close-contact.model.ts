export interface CloseContact {
    contact_num: string,
    contact_start_time: string,
    contact_end_time: string,
    way_of_interview: string,
    exposure_type: string,
    exposure_details: {
        detail: string,
        is_entrance: number,
        exposure_type: string
    }[],
    email: string,
    name: string,
    role: string
}

