import { createUser, getUserByEmail } from '../db/user'
import { Request, Response } from 'express'
import { authentication, random } from '../helpers/index'

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

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body

		if (!email || !password) {
			return res.sendStatus(400).json({
				success: false,
				message: 'Some fields are missing.'
			})
		}

		const user = await getUserByEmail(email).select(
			'+authentication.salt +authentication.password'
		)
		if (!user) {
			return res.sendStatus(400).json({
				success: false,
				message: 'No user registered with that email. Register first.'
			})
		}

		const expectedHash = authentication(user.authentication.salt, password)

		if (user.authentication.password !== expectedHash) {
			return res.sendStatus(403).json({
				success: false,
				message: 'Unauthorized'
			})
		}

		const salt = random()
		user.authentication.sessionToken = authentication(salt, user._id.toString())

		await user.save()

		res.cookie('REST_AUTH', user.authentication.sessionToken, {
			domain: 'localhost',
			path: '/'
		})

		return res.status(200).json(user).end()
	} catch (error) {
		console.log(error)
		return res.sendStatus(400).json({
			success: false,
			message: 'Something went wrong!'
		})
	}
}
