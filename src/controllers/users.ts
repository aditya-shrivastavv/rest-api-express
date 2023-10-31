import { Request, Response } from 'express'
import { getUsers } from '../db/user'

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await getUsers()

		return res.status(200).json(users)
	} catch (error) {
		console.log(error)
		return res.sendStatus(400).json({
			success: false,
			message: 'Something went wrong!'
		})
	}
}
