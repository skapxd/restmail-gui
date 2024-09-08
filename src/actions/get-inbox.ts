export const getInbox = async (email: string) => {
  const response = await fetch(`https://restmail.net/mail/${email}`)
    .then((res) => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json()
    })
    .then((res: any[]) => {
      return res.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    })

    return response as any[]
}