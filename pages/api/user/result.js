import Users from '../../../models/userModel'

export default async (req, res) => {
  try {
    const { userName } = req.query
    const user = await Users.findOne({ userName })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }   

    return res.status(200).json({ result: user.result })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Server error' })
  }
}
