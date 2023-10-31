import { createUser, getUserByEmail } from 'db/user'
import { Request, Response } from 'express'
import { random } from 'helpers'

export const register = async (req: Request, res: Response) => {
	try {
		const { email, password, username } = req.body

		if (!email || !password || !username) {
			return res.sendStatus(400).json({
				success: false,
				message: 'Some fields are missing.'
			})
		}

		const existingUser = await getUserByEmail(email)
		if (existingUser) {
			return res.sendStatus(400).json({
				success: false,
				message: "User already registered. Can't register again."
			})
		}

		const salt = random()
		const user = await createUser({
			email,
			username,
			authentication: {
				salt,
				password
			}
		})

		return res
			.status(200)
			.json({ success: true, message: 'User registered successfully.', user })
	} catch (error) {
		console.log(error)
		return res.sendStatus(400).json({
			success: false,
			message: 'Something went wrong!'
		})
	}
}
