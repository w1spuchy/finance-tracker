const categoryData = [
    { label: "Еда", value: 1500 },
    { label: "Транспорт", value: 800 },
    { label: "Развлечения", value: 500 },
    { label: "Жилье", value: 400.55 }
];


const daysData = [
    { day: "Пн", value: 200 },
    { day: "Вт", value: 450 },
    { day: "Ср", value: 300 },
    { day: "Чт", value: 600 },
    { day: "Пт", value: 120 },
    { day: "Сб", value: 850.55 },
    { day: "Вс", value: 400 }
];

document.addEventListener("DOMContentLoaded", () => {
    const ctxPie = document.getElementById('month-canvas').getContext('2d');
    function getFormatter(currency, withDecimals=false){
        return new Intl.NumberFormat('ru-RU',
        {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: withDecimals ? 2 : 0,
            maximumFractionDigits: withDecimals ? 2 : 0,
        });
    } 
        
    new Chart(ctxPie, {
        type: 'doughnut', // 'pie' - обычный пирог, 'doughnut' - пончик (популярнее сейчас)
        data: {
            labels: categoryData.map(item => item.label), // ["Еда", "Транспорт", ...]
            datasets: [{
                label: 'Сумма расходов',
                data: categoryData.map(item => item.value), // [1500, 800, ...]
                backgroundColor: [
                    '#FF6384', // Красный
                    '#36A2EB', // Синий
                    '#FFCE56', // Желтый
                    '#4BC0C0'  // Зеленый
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const formatter = getFormatter("BYN", true);
                            return formatter.format(context.raw);
                        }
                    }
                }
            }
        }
    });

    const ctxBar = document.getElementById('week-canvas').getContext('2d');

    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: daysData.map(item => item.day),
            datasets: [{
                label: 'Расходы за день ($)',
                data: daysData.map(item => item.value), 
                backgroundColor: '#6c5ce7',
                borderColor: '#a29bfe',
                borderWidth: 1,
                borderRadius: 5 
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f0f0f0'
                    },
                    ticks: {
                        callback: function(value) {
                            const formatter = getFormatter("BYN")
                            return formatter.format(value);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false 
                    }
                }
            },
            plugins: {
                legend: {
                    display: false 
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const formatter = getFormatter("BYN", true)
                            return formatter.format(context.raw);
                        }
                    }
                }
            }
        }
    });
});