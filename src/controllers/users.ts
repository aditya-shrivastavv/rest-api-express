import { Request, Response } from 'express'
import { deleteUserById, getUsers } from '../db/user'

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

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params

		const deletedUser = await deleteUserById(id)

		return res.json(deletedUser)
	} catch (error) {
		console.log(error)
		return res.sendStatus(400).json({
			success: true,
			message: 'Something went wrong!'
		})
	}
}
