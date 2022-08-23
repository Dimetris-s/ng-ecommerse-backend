import { Request, Response } from 'express';
import { Order, OrderItem } from '../models';
import { IRequest } from '../@types';
import { IOrder } from '../models/order.model';

class OrderController {
    public async getAll(req: Request, res: Response) {
        try {
            const orders = await Order.find()
                .populate('user', 'name')
                .sort({ dateOrdered: -1 });
            res.status(200).json(orders);
        } catch (e) {
            res.status(500).json({ success: false, error: e });
        }
    }

    public async getOne(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        try {
            const order = await Order.findById(id)
                .populate('user', 'name')
                .populate({
                    path: 'orderItems',
                    populate: {
                        path: 'product',
                        populate: 'category',
                    },
                });
            res.status(200).json(order);
        } catch (e) {
            res.status(500).json({ success: false, error: e });
        }
    }

    public async create(req: IRequest<IOrder>, res: Response) {
        const orderItemsIdsPromises = req.body.orderItems.map(async (item) => {
            let newOrderItem = new OrderItem({
                product: item.product,
                quantity: item.quantity,
            });
            newOrderItem = await newOrderItem.save();
            return newOrderItem._id;
        });
        const orderItemsIds = await Promise.all(orderItemsIdsPromises);
        const totalPrices = await Promise.all(
            orderItemsIds.map(async (orderItemId) => {
                const orderItem = await OrderItem.findById(
                    orderItemId
                ).populate('product');
                if (!orderItem) {
                    return res.status(404).send('order item not found');
                }
                return orderItem.product.price * orderItem.quantity;
            })
        );
        const totalPrice = totalPrices.reduce((acc, price) => {
            // @ts-ignore
            return acc + Number(price);
        }, 0);
        try {
            let order = new Order({
                shippingAddress1: req.body.shippingAddress1,
                shippingAddress2: req.body.shippingAddress2,
                city: req.body.city,
                zip: req.body.zip,
                country: req.body.country,
                phone: req.body.phone,
                status: req.body.status,
                totalPrice: totalPrice,
                user: req.body.user,
                orderItems: orderItemsIds,
            });
            order = await order.save();
            if (!order) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Can not create order' },
                });
            }
            res.status(201).json(order);
        } catch (e) {
            res.status(500).json({ success: false, error: e });
        }
    }

    public async updateStatus(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;

            const foundOrder = await Order.findByIdAndUpdate(
                id,
                {
                    status: req.body.status,
                },
                { new: true }
            );
            if (!foundOrder) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Not found!' },
                });
            }
            res.status(200).json(foundOrder);
        } catch (e) {
            res.status(500).json({ success: false, error: e });
        }
    }

    public async remove(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        try {
            const order = await Order.findByIdAndRemove(id);
            if (!order) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Not found!' },
                });
            }
            await Promise.all(
                order.orderItems.map(async (item) => {
                    await OrderItem.findByIdAndRemove(item);
                })
            );
            res.status(200).json(order);
        } catch (e) {
            res.status(500).json({ success: false, error: e });
        }
    }

    async getTotalSales(req: Request, res: Response) {
        const totalSales = await Order.aggregate([
            { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } },
        ]);
        console.log('totalSales', totalSales);

        if (!totalSales) {
            return res.status(400).send('The order sales cannot be generated');
        }

        res.send({ totalsales: totalSales.pop().totalsales });
    }

    public async getCount(req: Request, res: Response) {
        const orderCount = await Order.countDocuments();

        if (!orderCount) {
            res.status(500).json({ success: false });
        }
        res.send({
            orderCount: orderCount,
        });
    }

    public async getUserOrders(
        req: Request<{ userId: string }>,
        res: Response
    ) {
        const userOrderList = await Order.find({
            user: req.params.userId,
        }).populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                populate: 'category',
            },
        });

        if (!userOrderList) {
            res.status(500).json({ success: false });
        }
        res.send({
            userOrderList,
        });
    }
}

export default new OrderController();
